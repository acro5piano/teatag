import { Command } from '@commander-js/extra-typings'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'

export const program = new Command()

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
  const stringsWithLocations = new Map<string, string[]>()

  // Recursively find all TypeScript/JavaScript files
  const files = await findSourceFiles(srcDir)

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const extractedData = extractTemplateStrings(content, file)
    
    for (const {text, locations} of extractedData) {
      if (!stringsWithLocations.has(text)) {
        stringsWithLocations.set(text, [])
      }
      stringsWithLocations.get(text)!.push(...locations)
    }
  }

  // Create locale file
  const localeFile = path.join(outDir, `${lang}.yaml`)
  const existingTranslations: Record<string, string> = {}

  // If file exists, load existing translations
  if (fs.existsSync(localeFile)) {
    try {
      const existing = yaml.load(
        fs.readFileSync(localeFile, 'utf-8'),
      ) as Record<string, string>
      Object.assign(existingTranslations, existing)
    } catch (error) {
      console.warn(`Warning: Could not parse existing ${localeFile}`)
    }
  }

  // Ensure output directory exists
  fs.mkdirSync(outDir, { recursive: true })

  // Generate YAML content with comments
  let yamlContent = ''
  const sortedStrings = Array.from(stringsWithLocations.entries()).sort(([a], [b]) => a.localeCompare(b))
  
  for (const [text, locations] of sortedStrings) {
    // Add comment with source locations
    for (const location of locations) {
      yamlContent += `#: ${location}\n`
    }
    
    // Add the translation entry
    const translation = existingTranslations[text] || ''
    yamlContent += `'${text}': '${translation}'\n`
    
    // Add empty line between entries
    yamlContent += '\n'
  }

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

export function extractTemplateStrings(content: string, filePath?: string): Array<{text: string, locations: string[]}> {
  const stringsMap = new Map<string, string[]>()

  // Look for template literals with 't' tag
  // Use word boundary to ensure 't' is standalone and directly followed by backtick
  const templateRegex = /\bt`([^`]+)`/g
  let match

  const lines = content.split('\n')

  while ((match = templateRegex.exec(content)) !== null) {
    const templateContent = match[1]
    const matchStart = match.index
    
    // Find line number
    let lineNumber = 1
    let charCount = 0
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1 // +1 for newline
      if (charCount > matchStart) {
        lineNumber = i + 1
        break
      }
    }

    const location = filePath ? `${filePath}:${lineNumber}` : `line ${lineNumber}`
    
    if (!stringsMap.has(templateContent)) {
      stringsMap.set(templateContent, [])
    }
    stringsMap.get(templateContent)!.push(location)
  }

  return Array.from(stringsMap.entries()).map(([text, locations]) => ({
    text,
    locations
  }))
}
