# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
pnpm build          # Build TypeScript to dist/
pnpm test           # Run tests in watch mode
pnpm test:run       # Run tests once
```

To test the CLI locally:
```bash
node bin/teatag.js extract --lang ja --src ./examples
```

## Architecture

teatag is a simple i18n library with two main components:

1. **Runtime library** (`src/index.ts`): Provides `getTranslation()` and `addLocale()` functions. Uses tagged template literals (`t\`Hello, ${name}!\``) for translations. The `keyMatches()` function compares template static parts against YAML keys to find matching translations.

2. **CLI tool** (`src/cli.ts` → `bin/teatag.js`): The `extract` command scans source files for `t\`...\`` patterns using regex (`/\bt\`([^`]+)\`/g`) and outputs YAML files with source location comments.

Translation files use YAML format with placeholder syntax preserved:
```yaml
'Hello, ${name}!': 'こんにちは、${name}！'
```

The runtime maps variable names from keys to values, allowing reordering of placeholders in translations.
