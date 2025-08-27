<p align="center">
  <img src="logo.png" alt="teatag logo" width="120" />
</p>

# teatag

A dead simple i18n solution for Vanilla JS, React, TypeScript, and Astro

## Features

- **Dead simple**: Just use `t` tag - no complex setup, Babel, SWC settings are required
- **Framework agnostic**: Works with React, Astro, Vanilla JS, and more
- **YAML-based**: Human-readable translation files
- **Fast extraction**: CLI tool extracts all translatable strings using regular expressions

## Installation

```bash
npm install teatag
# or
pnpm add teatag
# or
yarn add teatag
```

## Quick Start

### 1. Write your code with `t` tagged template literals

```tsx
import { getTranslation } from 'teatag'

function getLocale() {
  // Get locale from your app (environment, user preference, etc.)
  return 'en'
}

const t = getTranslation(getLocale())
const name = 'John'

console.log(t`Hello, ${name}!`)
console.log(t`Welcome to our app!`)
```

### 2. Extract translatable strings

```bash
npx teatag extract --lang ja
```

This creates a `locales/ja.yaml` file with extracted strings:

```yaml
'Hello, ${name}!': ''
'Welcome to our app!': ''
```

### 3. Add your translations

Edit the generated YAML file:

```yaml
'Hello, ${name}!': 'こんにちは、${name}！'
'Welcome to our app!': '私たちのアプリへようこそ！'
```

### 4. Load translations and use them

**Node.js:**

```tsx
import { addLocale, getTranslation } from 'teatag'
import fs from 'fs'

// Load translations
const jaTranslations = fs.readFileSync('./locales/ja.yaml', 'utf-8')
addLocale('ja', jaTranslations)

// Use translations
const t = getTranslation('ja')
const name = 'John'

console.log(t`Hello, ${name}!`) // Output: こんにちは、John！
console.log(t`Welcome to our app!`) // Output: 私たちのアプリへようこそ！
```

**Frontend (Vite):**

Configure your `vite.config.ts` to handle YAML files:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.yaml'],
})
```

Then import and use translations:

```tsx
import { addLocale, getTranslation } from 'teatag'
import ja from '../path/to/locales/ja.yaml?raw'

// Load translations
addLocale('ja', ja)

// Use translations
const t = getTranslation('ja')
const name = 'John'

console.log(t`Hello, ${name}!`) // Output: こんにちは、John！
console.log(t`Welcome to our app!`) // Output: 私たちのアプリへようこそ！
```

## CLI Commands

The CLI automatically extracts strings from:

- `.ts` - TypeScript files
- `.tsx` - TypeScript React files
- `.js` - JavaScript files
- `.jsx` - JavaScript React files
- `.astro` - Astro components

**Examples:**

```bash
# Extract to Japanese
npx teatag extract --lang ja

# Custom source and output directories
npx teatag extract --lang fr --src ./app --out ./translations
```

You can view full help text in the command line:

```
$ pnpm teatag extract --help

Usage: teatag extract [options]

Extract translatable strings from source code

Options:
  --lang <language>  Target language code (e.g., ja, fr, es)
  --src <directory>  Source directory to scan (default: "./src")
  --out <directory>  Output directory for locale files (default: "./locales")
  -h, --help         display help for command
```

Check out the [`examples/`](./examples/) directory for more examples.

## API Reference

`getTranslation(locale: string)`

Returns a template literal function for the specified locale.

```tsx
const t = getTranslation('ja')
const result = t`Hello, ${name}!`
```

`addLocale(locale: string, yamlContent: string)`

Loads translations from YAML content for the specified locale.

```tsx
import fs from 'fs'

const yamlContent = fs.readFileSync('./locales/ja.yaml', 'utf-8')
addLocale('ja', yamlContent)
```

## Why Yaml?

teatag uses .yaml over .po for

- Translator readability
- No need for complex extract/transform/conversion between po<->json
- Easier to port to other languages

## License

MIT
