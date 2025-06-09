<p align="center">
  <img src="logo.png" alt="teatag logo" width="120" />
</p>

# teatag

A dead simple i18n solution for Vanilla JS, React, TypeScript, and Astro

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
  resolve: {
    alias: {
      'src/': `${__dirname}/src/`,
      'locales/': `${__dirname}/locales/`,
    },
  },
})
```

Then import and use translations:

```tsx
import { addLocale, getTranslation } from 'teatag'
import ja from 'locales/ja.yaml?raw'

// Load translations
addLocale('ja', ja)

// Use translations
const t = getTranslation('ja')
const name = 'John'

console.log(t`Hello, ${name}!`) // Output: こんにちは、John！
console.log(t`Welcome to our app!`) // Output: 私たちのアプリへようこそ！
```

## Features

- **Dead simple**: Just use `t` tag - no complex setup, Babel, SWC settings are required
- **Type safe**: Full TypeScript support with strong typing
- **Framework agnostic**: Works with React, Astro, Vanilla JS, and more
- **Automatic extraction**: CLI tool finds and extracts all translatable strings
- **Numbered placeholders**: Uses `${1}`, `${2}` format for predictable variable replacement
- **YAML-based**: Human-readable translation files (chosen over .po files for translator readability and no need for complex extract/transform/conversion between po<->json)
- **Fallback support**: Automatically falls back to original text when translations are missing

## CLI Commands

### Extract strings

```bash
npx teatag extract --lang <locale> [options]
```

**Options:**

- `--lang <locale>`: Target language code (e.g., `ja`, `fr`, `es`) **[required]**
- `--src <directory>`: Source directory to scan (default: `./src`)
- `--out <directory>`: Output directory for locale files (default: `./locales`)

**Examples:**

```bash
# Extract to Japanese
npx teatag extract --lang ja

# Custom source and output directories
npx teatag extract --lang fr --src ./app --out ./translations
```

## Supported File Types

The CLI automatically extracts strings from:

- `.ts` - TypeScript files
- `.tsx` - TypeScript React files
- `.js` - JavaScript files
- `.jsx` - JavaScript React files
- `.astro` - Astro components

## How It Works

1. **Template literals**: Use `t` tag in your code
2. **Extraction**: CLI scans your code and finds all tagged templates
3. **Placeholders**: Variables like `${name}` are preserved as `${name}` in the extracted strings
4. **Translation**: Edit YAML files with your translations using the same variable names
5. **Runtime**: Load translations and get localized output

## Examples

Check out the [`examples/`](./examples/) directory for complete examples including:

- Basic Node.js usage
- React components with i18n
- Astro page components
- Interactive workflow demonstration

## API Reference

### `getTranslation(locale: string)`

Returns a template literal function for the specified locale.

```tsx
const t = getTranslation('ja')
const result = t`Hello, ${name}!`
```

### `addLocale(locale: string, yamlContent: string)`

Loads translations from YAML content for the specified locale.

```tsx
import fs from 'fs'

const yamlContent = fs.readFileSync('./locales/ja.yaml', 'utf-8')
addLocale('ja', yamlContent)
```

## License

MIT
