import { describe, it, expect, beforeEach } from 'vitest'
import { addLocale, getTranslation } from './index'

describe('teatag', () => {
  beforeEach(() => {
    // Clear locales before each test
    // Note: We don't have a clear function, so we'll work around this
  })

  describe('getTranslation', () => {
    it('should return original string when no translation exists', () => {
      const t = getTranslation('en')
      const name = 'John'
      const result = t`Hello, ${name}!`
      expect(result).toBe('Hello, John!')
    })

    it('should return translated string when translation exists', () => {
      const yamlContent = `'Hello, \${name}!': 'こんにちは、\${name}！'`
      addLocale('ja', yamlContent)

      const t = getTranslation('ja')
      const name = 'John'
      const result = t`Hello, ${name}!`
      expect(result).toBe('こんにちは、John！')
    })

    it('should handle multiple placeholders', () => {
      const t = getTranslation('en')
      const name = 'John'
      const age = 25
      const result = t`Hello, ${name}! You are ${age} years old.`
      expect(result).toBe('Hello, John! You are 25 years old.')
    })

    it('should handle multiple placeholders with translations', () => {
      const yamlContent = `'Hello, \${name}! You are \${age} years old.': 'こんにちは、\${name}！あなたは\${age}歳です。'`
      addLocale('ja', yamlContent)

      const t = getTranslation('ja')
      const name = 'John'
      const age = 25
      const result = t`Hello, ${name}! You are ${age} years old.`
      expect(result).toBe('こんにちは、John！あなたは25歳です。')
    })

    it('should handle strings without placeholders', () => {
      const t = getTranslation('en')
      const result = t`Hello, world!`
      expect(result).toBe('Hello, world!')
    })

    it('should handle translations with variable names in placeholders', () => {
      const yamlContent = `'Hello, \${name}!': 'こんにちは、\${name}！'`
      addLocale('ja', yamlContent)

      const t = getTranslation('ja')
      const name = 'John'
      const result = t`Hello, ${name}!`
      expect(result).toBe('こんにちは、John！')
    })

    it('should handle multiple variable names in placeholders', () => {
      const yamlContent = `'Hello, \${name}! You are \${age} years old.': 'こんにちは、\${name}！あなたは\${age}歳です。'`
      addLocale('ja', yamlContent)

      const t = getTranslation('ja')
      const name = 'John'
      const age = 25
      const result = t`Hello, ${name}! You are ${age} years old.`
      expect(result).toBe('こんにちは、John！あなたは25歳です。')
    })

    it('should handle different variable orders between languages', () => {
      const yamlContent = `'I accept \${risk} as \${role}': '私は\${role}として\${risk}を受け入れます'`
      addLocale('ja', yamlContent)

      const t = getTranslation('ja')
      const risk = 'the responsibility'
      const role = 'manager'
      const result = t`I accept ${risk} as ${role}`
      expect(result).toBe('私はmanagerとしてthe responsibilityを受け入れます')
    })
  })

  describe('CLI extraction edge cases', () => {
    it('should respect --no-comments option', async () => {
      const fs = await import('node:fs')
      const path = await import('node:path')
      const os = await import('node:os')
      const { program } = await import('./cli')

      // Create temp directories
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatag-test-'))
      const srcDir = path.join(tmpDir, 'src')
      const outDir = path.join(tmpDir, 'locales')
      fs.mkdirSync(srcDir)

      // Create a source file with a t`` template
      fs.writeFileSync(
        path.join(srcDir, 'test.ts'),
        `const t = getTranslation('en')\nconst msg = t\`Hello world\`\n`
      )

      // Run with comments (default)
      await program.parseAsync(['node', 'teatag', 'extract', '--lang', 'ja', '--src', srcDir, '--out', outDir])
      const withComments = fs.readFileSync(path.join(outDir, 'ja.yaml'), 'utf-8')
      expect(withComments).toContain('#:')

      // Run without comments
      await program.parseAsync(['node', 'teatag', 'extract', '--lang', 'ja', '--src', srcDir, '--out', outDir, '--no-comments'])
      const withoutComments = fs.readFileSync(path.join(outDir, 'ja.yaml'), 'utf-8')
      expect(withoutComments).not.toContain('#:')

      // Cleanup
      fs.rmSync(tmpDir, { recursive: true })
    })

    it('should not extract false positive matches', async () => {
      // Import the extraction function to test it directly
      const { extractTemplateStrings } = await import('./cli')
      
      const problematicCode = `
// Edge cases that should NOT be extracted
async (t) => {
  mockdate.set('2023-07-10T00:00')
  console.log('test')
}

// t separated from backtick by newline - should NOT match
const value = t
\`this should not be extracted\`

// t as part of another identifier - should NOT match  
const methodt = obj.methodt\`should not match\`
const att = someatt\`should not match\`

// Valid cases that SHOULD match
const t = getTranslation('en')
const result = t\`Hello world!\`
const name = 'John'
const message = t\`Hello, \${name}!\`

// Standalone t with immediate backtick
t\`Actual tagged template\`

// t after whitespace/operators - should match
const x = true ? t\`conditional template\` : ''
return t\`return template\`

// Regular templates without t tag - should NOT match
const regular = \`regular template\`
      `
      
      const extracted = extractTemplateStrings(problematicCode)
      
      // Should only extract the legitimate tagged templates
      expect(extracted.map(e => e.text)).toEqual([
        'Hello world!',
        'Hello, ${name}!',
        'Actual tagged template',
        'conditional template',
        'return template'
      ])
      
      // Should NOT extract things that aren't valid tagged templates
      expect(extracted.map(e => e.text)).not.toContain(expect.stringContaining('this should not be extracted'))
      expect(extracted.map(e => e.text)).not.toContain(expect.stringContaining('should not match'))
      expect(extracted.map(e => e.text)).not.toContain(expect.stringContaining('regular template'))
      expect(extracted.map(e => e.text)).not.toContain(expect.stringContaining('mockdate'))
    })
  })

  describe('addLocale', () => {
    it('should parse valid YAML content', () => {
      const yamlContent = `
'Hello, world!': 'こんにちは、世界！'
'Goodbye': 'さようなら'
      `

      expect(() => addLocale('ja', yamlContent)).not.toThrow()
    })

    it('should throw error for invalid YAML', () => {
      const invalidYaml = `
invalid: yaml: content:
  - broken
    syntax
      `

      expect(() => addLocale('ja', invalidYaml)).toThrow()
    })

    it('should handle empty YAML content', () => {
      expect(() => addLocale('en', '')).not.toThrow()
    })
  })
})
