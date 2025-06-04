import * as yaml from 'js-yaml';

type TranslationMap = Record<string, string>;
type Locale = string;

const locales: Map<Locale, TranslationMap> = new Map();

export function addLocale(locale: Locale, yamlContent: string): void {
  try {
    const translations = yaml.load(yamlContent) as TranslationMap;
    locales.set(locale, translations || {});
  } catch (error) {
    throw new Error(`Failed to parse YAML for locale ${locale}: ${error}`);
  }
}

export function getTranslation(locale: Locale) {
  const translations = locales.get(locale) || {};
  
  return function t(strings: TemplateStringsArray, ...values: any[]): string {
    // Create the key pattern that matches what we extract (with placeholder names)
    const key = strings.reduce((acc, str, i) => {
      return acc + str + (i < values.length ? `\${${getPlaceholderName(values, i)}}` : '');
    }, '');
    
    // Get translation or use original template
    const translation = translations[key];
    
    if (translation) {
      // Replace placeholders in translation with actual values
      let result = translation;
      values.forEach((value, i) => {
        const placeholderName = getPlaceholderName(values, i);
        result = result.replace(`\${${placeholderName}}`, String(value));
      });
      return result;
    }
    
    // Fallback: return the original interpolated string
    return strings.reduce((acc, str, i) => {
      return acc + str + (i < values.length ? String(values[i]) : '');
    }, '');
  };
}

function getPlaceholderName(values: any[], index: number): string {
  // Try to infer meaningful names from variable context
  // For now, just use generic names
  return ['name', 'value', 'item', 'count', 'data'][index] || `arg${index}`;
}