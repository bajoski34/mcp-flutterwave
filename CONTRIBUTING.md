# Contributing to mcp-flutterwave

Thank you for your interest in contributing to mcp-flutterwave! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Flutterwave account with API access
- Basic knowledge of TypeScript and the Model Context Protocol (MCP)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/mcp-flutterwave.git
   cd mcp-flutterwave
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Flutterwave secret key
   echo "FLW_SECRET_KEY=your_secret_key_here" >> .env
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Test the MCP server**
   ```bash
   node build/index.js --tools=all
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Ensure proper error handling

### Project Structure

```
src/
├── client/           # Flutterwave API client
│   ├── http/        # HTTP client configuration
│   ├── lib/         # API endpoint implementations
│   ├── specs/       # OpenAPI specifications
│   └── types/       # Generated TypeScript types
├── config/          # Configuration files
├── tools/           # MCP tool implementations
├── types/           # Type definitions and schemas
└── server.ts        # MCP server setup
```

### Adding New Tools

1. **Create the tool implementation** in `src/tools/`
   ```typescript
   // src/tools/your-tool.ts
   import { server } from "../server.js";
   import { z } from "zod";

   export async function yourToolFunction(params: YourParams) {
     // Implementation
     return {
       content: [{ type: "text" as const, text: "Result" }]
     };
   }

   export function registerYourTool() {
     server.tool(
       "your.tool.name",
       "Description of your tool",
       YourParamsSchema.shape,
       async (args) => {
         return await yourToolFunction(args);
       }
     );
   }
   ```

2. **Add the schema** in `src/types/your-tool/schema.ts`
   ```typescript
   import { z } from "zod";

   export const YourParamsSchema = z.object({
     param1: z.string().min(1, "Required parameter"),
     param2: z.number().optional()
   });
   ```

3. **Register the tool** in `src/registered-tools.ts`

4. **Update documentation** and tool lists in relevant files

### API Client Development

When adding new Flutterwave API endpoints:

1. **Add OpenAPI spec** in `src/client/specs/v3/`
2. **Generate types** using `npm run build:types`
3. **Implement client class** in `src/client/lib/`
4. **Export from main client** in `src/client/index.ts`

### Testing

- Write unit tests for new functionality
- Test with actual Flutterwave API when possible
- Ensure error handling works correctly
- Test MCP tool integration with Claude Desktop

### Commit Guidelines

- Use conventional commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `refactor:` for code refactoring
  - `test:` for adding tests
  - `chore:` for maintenance tasks

Example:
```
feat: add subscription management tools
fix: handle null responses in checkout creation
docs: update README with new tool examples
```

## Supported Tools

Current tools that can be extended or improved:

- **Transactions**: Get transaction details, resend webhooks
- **Checkout**: Create payment links, disable links
- **Plans**: Create and retrieve subscription plans
- **Refunds**: Process transaction refunds
- **Subscriptions**: Manage customer subscriptions

## Common Issues and Solutions

### TypeScript Errors

- Ensure all types are properly imported
- Use `as const` for literal types in MCP responses
- Check that Zod schemas match the expected API parameters

### MCP Integration Issues

- Verify tool schemas use `.shape` property for registration
- Ensure return objects match MCP content format
- Check that all async functions properly handle errors

### API Client Issues

- Verify OpenAPI specifications are accurate
- Regenerate types after spec changes: `npm run build:types`
- Check HTTP client configuration in `src/client/http/`

## Submitting Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test your changes**
   ```bash
   npm run build
   npm test # if tests are available
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: describe your changes"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Fill out the PR template** with:
   - Description of changes
   - Testing performed
   - Any breaking changes
   - Screenshots if applicable

## Code Review Process

- All contributions require review
- Address feedback promptly
- Ensure CI checks pass
- Maintain backward compatibility when possible

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in existing issues
- Check the [MCP documentation](https://modelcontextprotocol.io) for protocol details
- Review [Flutterwave API docs](https://developer.flutterwave.com) for API details

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
