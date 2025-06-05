import * as yaml from 'js-yaml'

type TranslationMap = Record<string, string>
type Locale = string

const locales: Map<Locale, TranslationMap> = new Map()

export function addLocale(locale: Locale, yamlContent: string): void {
  try {
    const translations = yaml.load(yamlContent) as TranslationMap
    locales.set(locale, translations || {})
  } catch (error) {
    throw new Error(`Failed to parse YAML for locale ${locale}: ${error}`)
  }
}

export function getTranslation(locale: Locale) {
  const translations = locales.get(locale) || {}

  return function t(strings: TemplateStringsArray, ...values: any[]): string {
    // Find a matching translation key by comparing template structure
    let translation: string | undefined
    let matchedKey: string | undefined

    for (const [key, trans] of Object.entries(translations)) {
      if (keyMatches(key, strings)) {
        translation = trans
        matchedKey = key
        break
      }
    }

    if (translation) {
      // Replace placeholders in translation with actual values by position
      let result = translation
      const placeholderRegex = /\$\{([^}]+)\}/g
      let placeholderIndex = 0
      
      result = result.replace(placeholderRegex, (match, varName) => {
        if (placeholderIndex < values.length) {
          return String(values[placeholderIndex++])
        }
        return match
      })
      
      return result
    }

    // Fallback: return the original interpolated string
    return strings.reduce((acc, str, i) => {
      return acc + str + (i < values.length ? String(values[i]) : '')
    }, '')
  }
}

function keyMatches(key: string, strings: TemplateStringsArray): boolean {
  // Split the key by placeholder patterns to get the static parts
  const keyParts = key.split(/\$\{[^}]+\}/)
  
  // Check if static parts match the template strings
  if (keyParts.length !== strings.length) {
    return false
  }
  
  return keyParts.every((part, i) => part === strings[i])
}
