import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { DirectTransfersPostBody } from '../../client/generated/v4/direct-transfers.zod.js';
import { v4JsonResult } from './httpResult.js';

export const CreateOrchestratorTransferSchema = {
  type: z
    .enum(['bank', 'mobile_money', 'wallet', 'cash_pickup', 'crypto'])
    .describe('Transfer rail.'),
  action: z
    .enum(['instant', 'deferred', 'scheduled'])
    .describe('When the transfer should be processed.'),
  reference: z
    .string()
    .min(6)
    .max(42)
    .regex(/^[a-zA-Z0-9-]+$/)
    .optional()
    .describe('Unique transfer reference.'),
  narration: z.string().min(1).max(180).optional(),
  callback_url: z.string().optional(),
  meta: z.record(z.string(), z.string()).optional(),
  disburse_option: z
    .object({
      date_time: z.string().optional(),
      timezone: z.string().optional(),
    })
    .optional()
    .describe('Required when action is scheduled.'),
  payment_instruction: z
    .record(z.string(), z.unknown())
    .describe(
      'Rail-specific recipient, sender, currencies, and amount. Validated against the v4 direct transfer schema.',
    ),
};

export type CreateOrchestratorTransferArgs = {
  type: 'bank' | 'mobile_money' | 'wallet' | 'cash_pickup' | 'crypto';
  action: 'instant' | 'deferred' | 'scheduled';
  reference?: string;
  narration?: string;
  callback_url?: string;
  meta?: Record<string, string>;
  disburse_option?: { date_time?: string; timezone?: string };
  payment_instruction: Record<string, unknown>;
};

export async function createOrchestratorTransfer(
  args: CreateOrchestratorTransferArgs,
) {
  const strict = z.object(CreateOrchestratorTransferSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Orchestrator transfer failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = DirectTransfersPostBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Orchestrator transfer body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/direct-transfers', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'create orchestrator transfer');
}
