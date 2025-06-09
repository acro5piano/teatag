# Teatag Examples

This directory contains complete examples showing how to use teatag in different environments.

## Files

- `src/basic-usage.ts` - Basic Node.js example with multiple locales
- `src/react-component.tsx` - React component examples with user profile and language switcher
- `src/astro-page.astro` - Complete Astro blog page with i18n
- `locales/ja.yaml` - Japanese translations for the examples
- `package.json` - Example scripts for extraction and running

## Running the Examples

### 1. Build teatag first
```bash
cd ..
pnpm build
```

### 2. Extract translatable strings
```bash
cd examples
pnpm extract           # Extract for Japanese
```

### 3. Translate the strings
The Japanese translations are already provided in `locales/ja.yaml`. You can add more languages by creating additional YAML files:

**locales/ja.yaml (existing):**
```yaml
'Hello, ${name}!': 'こんにちは、${name}！'
'You are ${age} years old.': 'あなたは${age}歳です。'
'Welcome to teatag!': 'teatagへようこそ！'
'User Profile': 'ユーザープロフィール'
'Name:': '名前:'
'Email:': 'メール:'
'Age:': '年齢:'
'${age} years old': '${age}歳'
'Edit Profile': 'プロフィール編集'
'Delete Account': 'アカウント削除'
'Welcome, ${name}! You have ${getUnreadCount()} unread messages.': 'ようこそ、${name}さん！未読メッセージが${getUnreadCount()}件あります。'
'My Blog': 'マイブログ'
'My Awesome Blog': '私の素晴らしいブログ'
'Home': 'ホーム'
'About': 'について'
'Contact': 'お問い合わせ'
'Welcome to my blog!': '私のブログへようこそ！'
'Published on ${post.date}': '${post.date}に公開'
'Read more': '続きを読む'
'Subscribe to Newsletter': 'ニュースレター購読'
'Enter your email': 'メールアドレスを入力'
'Subscribe': '購読'
'English': '英語'
'Japanese': '日本語'
'French': 'フランス語'
```

### 4. Run the examples
```bash
# Basic usage example (Node.js)
pnpm run:basic

# React component example
npx tsx src/react-component.tsx

# Astro page example (requires Astro project setup)
# See astro-page.astro for the component code
```

## Example Workflow

1. **Write code** with `t\`\`` tagged template literals
2. **Extract strings** using the CLI tool: `teatag extract --lang ja`
3. **Translate** the generated YAML files
4. **Load translations** in your app using `addLocale()`
5. **Use translations** with `getTranslation(locale)`

## Framework-Specific Notes

### React
- Use `getTranslation()` in components
- Pass locale as props or use React Context
- Template literals work seamlessly in JSX

### Astro
- Load translations server-side in frontmatter
- Use translations in both the component script and template
- Perfect for static site generation with i18n
- Example shows a complete blog page with navigation, content, and footer

### Vanilla JS/TS
- Simple function calls
- Works in any JavaScript environment
- No framework dependencies

## Key Features Demonstrated

- ✅ Template literal syntax with placeholders (`${name}`, `${age}`, etc.)
- ✅ Automatic string extraction via CLI tool
- ✅ YAML-based translation files
- ✅ Fallback to original strings when translations missing
- ✅ Multiple placeholder support with preserved variable names
- ✅ Framework agnostic usage (React, Astro, Node.js)
- ✅ TypeScript support with strong typing
- ✅ Server-side rendering compatibility
- ✅ Component-level translation management