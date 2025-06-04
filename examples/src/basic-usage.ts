import { addLocale, getTranslation } from '../../dist'
import * as fs from 'fs'

// Setup
function loadTranslations() {
  // Load Japanese translations
  const jaYaml = fs.readFileSync('./locales/ja.yaml', 'utf-8')
  addLocale('ja', jaYaml)

  // Load French translations (if exists)
  try {
    const frYaml = fs.readFileSync('./locales/fr.yaml', 'utf-8')
    addLocale('fr', frYaml)
  } catch {
    console.log('French translations not found, skipping...')
  }
}

// Example showing basic usage of teatag
function demonstrateTranslations() {
  const name = 'Alice'
  const age = 30

  console.log('=== English (default) ===')
  let t = getTranslation('en')
  console.log(t`Hello, ${name}!`)
  console.log(t`You are ${age} years old.`)
  console.log(t`Welcome to teatag!`)

  console.log('\n=== Japanese ===')
  t = getTranslation('ja')
  console.log(t`Hello, ${name}!`)
  console.log(t`You are ${age} years old.`)
  console.log(t`Welcome to teatag!`)

  console.log('\n=== French (fallback to original) ===')
  t = getTranslation('fr')
  console.log(t`Hello, ${name}!`)
  console.log(t`You are ${age} years old.`)
  console.log(t`Welcome to teatag!`)
}

// Run the example
loadTranslations()
demonstrateTranslations()
