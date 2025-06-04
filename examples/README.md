# Teatag Examples

This directory contains complete examples showing how to use teatag in different environments.

## Files

- `basic-usage.ts` - Basic Node.js example
- `react-component.tsx` - React component examples
- `astro-page.astro` - Astro page component example
- `workflow-demo.ts` - Complete workflow demonstration
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
pnpm extract:fr        # Extract for French
pnpm extract:es        # Extract for Spanish
```

### 3. Translate the strings
Edit the generated YAML files in `./locales/` directory:

**locales/ja.yaml:**
```yaml
'Hello, ${name}!': 'こんにちは、${name}！'
'You are ${name} years old.': 'あなたは${name}歳です。'
'Welcome to teatag!': 'teatagへようこそ！'
'User Profile': 'ユーザープロフィール'
'Name:': '名前:'
'Email:': 'メール:'
'Age:': '年齢:'
'${name} years old': '${name}歳'
'Edit Profile': 'プロフィール編集'
'Delete Account': 'アカウント削除'
'Welcome, ${name}! You have ${value} unread messages.': 'ようこそ、${name}！未読メッセージが${value}件あります。'
'English': '英語'
'Japanese': '日本語'
'French': 'フランス語'
'Spanish': 'スペイン語'
'Language:': '言語:'
```

**locales/fr.yaml:**
```yaml
'Hello, ${name}!': 'Bonjour, ${name}!'
'You are ${name} years old.': 'Vous avez ${name} ans.'
'Welcome to teatag!': 'Bienvenue sur teatag!'
'User Profile': 'Profil utilisateur'
'Name:': 'Nom:'
'Email:': 'Email:'
'Age:': 'Âge:'
'${name} years old': '${name} ans'
'Edit Profile': 'Modifier le profil'
'Delete Account': 'Supprimer le compte'
'Welcome, ${name}! You have ${value} unread messages.': 'Bienvenue, ${name}! Vous avez ${value} messages non lus.'
'English': 'Anglais'
'Japanese': 'Japonais'
'French': 'Français'
'Spanish': 'Espagnol'
'Language:': 'Langue:'
```

### 4. Run the examples
```bash
# Basic usage example
npx tsx basic-usage.ts

# Complete workflow demonstration  
npx tsx workflow-demo.ts
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

### Vanilla JS/TS
- Simple function calls
- Works in any JavaScript environment
- No framework dependencies

## Key Features Demonstrated

- ✅ Template literal syntax with placeholders
- ✅ Automatic string extraction
- ✅ YAML-based translation files
- ✅ Fallback to original strings
- ✅ Multiple placeholder support
- ✅ Framework agnostic usage
- ✅ TypeScript support