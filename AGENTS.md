# Agent Guidelines for jellyfin-review

## Commands
- **Run**: `bun run index.ts`
- **Install**: `bun install`
- **Test**: `bun test` (for single test: `bun test <filename>`)
- **Type check**: `bunx tsc --noEmit`

## Code Style
- **Runtime**: Bun with TypeScript, ESNext target
- **Imports**: Use `import` syntax with explicit extensions when needed (`.ts` allowed via `allowImportingTsExtensions`)
- **Types**: Strict TypeScript enabled - all code must be fully typed, no `any` unless absolutely necessary
- **Formatting**: Follow existing style, use `verbatimModuleSyntax` (explicit type imports with `import type`)
- **Naming**: camelCase for variables/functions, PascalCase for types/classes/components
- **Error handling**: Prefer explicit error handling with proper types
- **Module system**: ES modules only (`"type": "module"`)

## TypeScript Config Notes
- `strict: true` with additional strict flags: `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`, `noImplicitOverride`
- `noEmit: true` - Bun handles execution directly
- Bundler module resolution - optimized for Bun runtime
