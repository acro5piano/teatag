#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings'
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const program = new Command()

program
  .name('teatag')
  .description('Dead simple i18n solution')
  .version('0.0.1-alpha.0')

program
  .command('extract')
  .description('Extract translatable strings from source code')
  .requiredOption(
    '--lang <language>',
    'Target language code (e.g., ja, fr, es)',
  )
  .option('--src <directory>', 'Source directory to scan', './src')
  .option('--out <directory>', 'Output directory for locale files', './locales')
  .action(async (options) => {
    const { lang, src, out } = options

    try {
      await extractStrings(src, out, lang)
      console.log(`Extracted strings to ${out}/${lang}.yaml`)
    } catch (error) {
      console.error('Error extracting strings:', error)
      process.exit(1)
    }
  })

async function extractStrings(
  srcDir: string,
  outDir: string,
  lang: string,
): Promise<void> {
  const strings = new Set<string>()

  // Recursively find all TypeScript/JavaScript files
  const files = await findSourceFiles(srcDir)

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const extractedStrings = extractTemplateStrings(content)
    extractedStrings.forEach((str) => strings.add(str))
  }

  // Create locale file
  const localeFile = path.join(outDir, `${lang}.yaml`)
  const translations: Record<string, string> = {}

  // If file exists, load existing translations
  if (fs.existsSync(localeFile)) {
    try {
      const existing = yaml.load(
        fs.readFileSync(localeFile, 'utf-8'),
      ) as Record<string, string>
      Object.assign(translations, existing)
    } catch (error) {
      console.warn(`Warning: Could not parse existing ${localeFile}`)
    }
  }

  // Add new strings with empty translations
  for (const str of strings) {
    if (!(str in translations)) {
      translations[str] = ''
    }
  }

  // Ensure output directory exists
  fs.mkdirSync(outDir, { recursive: true })

  // Write YAML file
  const yamlContent = yaml.dump(translations, {
    flowLevel: -1,
    quotingType: "'",
    forceQuotes: true,
  })

  fs.writeFileSync(localeFile, yamlContent)
}

async function findSourceFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      entry.name !== 'node_modules'
    ) {
      files.push(...(await findSourceFiles(fullPath)))
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx|astro)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

function extractTemplateStrings(content: string): string[] {
  const strings: string[] = []

  // Look for template literals with 't' tag - simpler regex
  const templateRegex = /t`([^`]+)`/g
  let match

  while ((match = templateRegex.exec(content)) !== null) {
    const templateContent = match[1]

    // Convert ${variable} to numbered placeholders: $1, $2, etc.
    let placeholderCount = 0
    const normalized = templateContent.replace(/\$\{[^}]+\}/g, () => {
      placeholderCount++
      return `\${${placeholderCount}}`
    })

    strings.push(normalized)
  }

  return strings
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Check if this is the main module being executed
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse()
}

export { program }
