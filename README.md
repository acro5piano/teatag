# teatag

A dead simple i18n solution in Vanilla JS, React, TS(X), and Astro

# Installation

```
pnpm install teatag
```

# Usage

1. Wrap your string with `t` tag:

```tsx
import { getTranslation } from 'teatag'

const t = getTranslation(getLocale())

const name = 'John'
console.log(t`Hello, ${name}!`)

// This is the stub implementation. For example get it from environment variables.
function getLocale() {
  return 'en'
}
```

2. Extract text:

```
pnpm teatag extract --lang ja
```

3. Translate

The previous command will create a file `locales/ja.yaml` in the current directory:

```yaml
'Hello, ${name}!': ''
```

Update them:

```yaml
'Hello, ${name}!': 'こんにちは、${name}！'
```

4. All set! Let's use the translated text:

```tsx
import { addLocale, getTranslation } from 'teatag'
import { readFileSync } from 'fs'

addLocale('ja', readFileSync('./locales/ja.yaml'))

const t = getTranslation('ja')

const name = 'John'
console.log(t`Hello, ${name}!`) // こんにちは、John！
```
