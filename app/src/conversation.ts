import Anthropic from "@anthropic-ai/sdk";
import type {
    BetaTool,
    BetaToolUnion,
    BetaMessageParam,
    BetaContentBlockParam,
} from "@anthropic-ai/sdk/resources/beta/messages/messages.js";
import type { MCPClient } from "./mcp-client.js";
import { TOOL_EXAMPLES } from "./tool-examples.js";

// ─── Constants ───────────────────────────────────────────────────────────────

const BETA_FLAG = "advanced-tool-use-2025-11-20";
const MODEL     = "claude-sonnet-4-6";

/**
 * Tools kept in context on every request.
 * Everything else is deferred and discovered via the tool search tool.
 * Chosen as the highest-frequency operations so the common path needs no search.
 */
const ALWAYS_LOADED = new Set([
    "create_checkout",
    "read_transaction",
    "charge_card",
    "create_transfer",
    "create_virtual_account",
]);

const SYSTEM_PROMPT = `You are a Flutterwave payment assistant. You help users with:
- Creating and managing payment/checkout links
- Charging customers via card, bank account, mobile money, M-Pesa, or USSD
- Creating virtual account numbers (NGN and GHS) for bank transfer collection
- Validating OTP-based charges using validate_charge
- Verifying transaction status and history
- Managing bank transfers and beneficiaries
- Creating and retrieving payment plans
- Paying bills (airtime, data, cable TV, electricity, internet) via the bill payment tools

Guidelines:
- Be concise. One sentence of confirmation is enough before calling a tool.
- When a charge returns auth_mode "pin" or "otp", remind the user to call validate_charge with the flw_ref.
- Currency must match the charge type: KES for M-Pesa, NGN for USSD, GHS/UGX/RWF/ZMW/XOF for mobile money.
- tx_ref values should be unique per transaction; suggest a slug like "TXN-<purpose>-<timestamp>" when the user hasn't provided one.
- For NGN static virtual accounts, bvn (11-digit Bank Verification Number) is mandatory.
- Virtual account order_ref is needed to retrieve or update an account — always share it with the user.
- Bill payment flow: get_bill_categories → get_bill_providers → get_bill_items → validate_bill_customer (skip for airtime/data) → pay_bill → get_bill_status.
- For electricity bills, the prepaid token is in the extra.token field of get_bill_status — share it with the customer.
- Bill payments are Nigeria-only (country: NG).
- FX trade flow: request_fx_quote → poll get_fx_quote until READY → initiate_fx_trade → poll get_fx_trade until SETTLED.
- FX quotes are valid for 5 minutes once READY. Minimum trade is $1,000 USD equivalent.
- FX trading is weekdays only (Monday–Friday). Supported pairs: NGN/USD, GHS/USD, USD/NGN.
- For verification: resolve_bank_account before transfers to confirm account name. verify_card_bin to look up card brand/type/issuer.
- BVN verification flow: initiate_bvn_verification → customer clicks consent URL → get_bvn_details with reference. Requires Flutterwave account enablement.
- Always show the resolved account name to the user before creating a transfer — let them confirm before proceeding.
- Stablecoin transfers use the Polygon network only (no Tron/Solana/Stellar). Supported coins: USDC and USDT.
- Stablecoin flow: get_stablecoin_fee → send_stablecoin (wallet-to-wallet) or convert_to_stablecoin (fiat→coin).
- For fiat→stablecoin: debit_currency is NGN or USD. For wallet transfers: debit_currency must match currency.
- Always call get_stablecoin_fee first so the user knows the net amount the recipient will receive.`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConversationMessage = {
    role: "user" | "assistant";
    text: string;
};

export type ToolCall = {
    name: string;
    input: Record<string, unknown>;
    result: string;
};

export type ChatResult = {
    reply: string;
    tool_calls: ToolCall[];
    ui_html: string[];
};

type MCPTool = Awaited<ReturnType<MCPClient["listTools"]>>[number];

// ─── Tool conversion ──────────────────────────────────────────────────────────

/**
 * Converts an MCP tool into the Anthropic beta tool format, adding:
 *  - input_examples  (Feature 3: Tool Use Examples)
 *  - defer_loading   (Feature 1: Tool Search — non-core tools deferred)
 *  - allowed_callers (Feature 2: Programmatic Tool Calling — all tools can be
 *                     called from code_execution, not just directly from Claude)
 */
function toAnthropicTool(tool: MCPTool): BetaTool {
    const examples = TOOL_EXAMPLES[tool.name];
    return {
        name: tool.name,
        description: tool.description ?? "",
        input_schema: (tool.inputSchema as BetaTool["input_schema"]) ?? {
            type: "object",
            properties: {},
        },
        // Feature 3: teach Claude Flutterwave-specific conventions
        ...(examples?.length ? { input_examples: examples } : {}),
        // Feature 1: keep only high-frequency tools in context by default
        defer_loading: !ALWAYS_LOADED.has(tool.name),
        // Feature 2: allow Claude's generated code to call any tool directly
        allowed_callers: ["code_execution_20250825"],
    } as BetaTool;
}

/**
 * The tool search tool (Feature 1).
 * Claude calls this when it needs a tool that isn't already in context.
 */
const TOOL_SEARCH_TOOL = {
    type: "tool_search_tool_regex_20251119",
    name: "tool_search_tool_regex",
} as const;

/**
 * The code execution tool (Feature 2).
 * Claude can write Python that orchestrates multiple tool calls, keeping
 * intermediate results out of Claude's context window.
 */
const CODE_EXECUTION_TOOL = {
    type: "code_execution_20250825",
    name: "code_execution",
} as const;

// ─── HTML extraction ──────────────────────────────────────────────────────────

function extractHtml(content: unknown[]): string[] {
    const html: string[] = [];
    for (const item of content) {
        if (
            typeof item === "object" &&
            item !== null &&
            (item as any).type === "resource"
        ) {
            const r = (item as any).resource;
            if (r && typeof r.text === "string") html.push(r.text);
        }
    }
    return html;
}

// ─── Main conversation function ───────────────────────────────────────────────

export async function chat(
    anthropic: Anthropic,
    mcpClient: MCPClient,
    history: ConversationMessage[],
    userMessage: string,
): Promise<ChatResult> {
    const mcpTools   = await mcpClient.listTools();
    const tools      = mcpTools.map(toAnthropicTool);

    const messages: BetaMessageParam[] = [
        ...history.map((m) => ({ role: m.role, content: m.text } as BetaMessageParam)),
        { role: "user", content: userMessage },
    ];

    const toolCalls: ToolCall[] = [];
    const uiHtml:    string[]   = [];

    // ── Agentic loop ─────────────────────────────────────────────────────────
    while (true) {
        const response = await anthropic.beta.messages.create({
            betas: [BETA_FLAG],
            model:      MODEL,
            max_tokens: 4096,
            system:     SYSTEM_PROMPT,
            tools: [
                TOOL_SEARCH_TOOL   as unknown as BetaToolUnion,
                CODE_EXECUTION_TOOL as unknown as BetaToolUnion,
                ...tools,
            ],
            messages,
        });

        if (response.stop_reason === "tool_use") {
            const assistantContent = response.content as unknown as BetaContentBlockParam[];
            messages.push({ role: "assistant", content: assistantContent });

            const toolResults: BetaContentBlockParam[] = [];

            for (const block of response.content) {
                // tool_search_tool results are handled automatically by the API;
                // we only need to dispatch actual MCP tool calls.
                if ((block as any).type !== "tool_use") continue;
                const tb = block as any;

                // Skip the built-in tools — the API resolves them internally
                if (
                    tb.name === "tool_search_tool_regex" ||
                    tb.name === "code_execution"
                ) continue;

                const result = await mcpClient.callTool(
                    tb.name,
                    tb.input as Record<string, unknown>,
                );

                const content = result.content as unknown[];
                const text    = content
                    .filter((c: any) => c.type === "text")
                    .map((c: any) => c.text as string)
                    .join("\n");

                uiHtml.push(...extractHtml(content));
                toolCalls.push({ name: tb.name, input: tb.input, result: text });

                toolResults.push({
                    type:        "tool_result",
                    tool_use_id: tb.id,
                    content:     text || "Done.",
                } as any);
            }

            if (toolResults.length > 0) {
                messages.push({ role: "user", content: toolResults });
            }
        } else {
            // end_turn or max_tokens — extract the final reply
            const reply = response.content
                .filter((b) => b.type === "text")
                .map((b) => (b as any).text as string)
                .join("\n");

            return { reply, tool_calls: toolCalls, ui_html: uiHtml };
        }
    }
}
