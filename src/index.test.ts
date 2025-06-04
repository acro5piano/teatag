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
      const yamlContent = `'Hello, \${1}!': 'こんにちは、\${1}！'`
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
      const yamlContent = `'Hello, \${1}! You are \${2} years old.': 'こんにちは、\${1}！あなたは\${2}歳です。'`
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
