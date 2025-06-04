import { addLocale, getTranslation } from '../../dist'
import * as fs from 'fs'

// Example showing basic usage of teatag

// 1. Define your translatable strings using the t`` tag
function greetUser(name: string, age: number) {
  const t = getTranslation('en') // Default locale

  console.log(t`Hello, ${name}!`)
  console.log(t`You are ${age} years old.`)
  console.log(t`Welcome to teatag!`)
}

// 2. Load translations from YAML files
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

// 3. Use translations in different languages
function demonstrateTranslations() {
  const name = 'Alice'
  const age = 30

  console.log('=== English (default) ===')
  const enT = getTranslation('en')
  console.log(enT`Hello, ${name}!`)
  console.log(enT`You are ${age} years old.`)
  console.log(enT`Welcome to teatag!`)

  console.log('\n=== Japanese ===')
  const jaT = getTranslation('ja')
  console.log(jaT`Hello, ${name}!`)
  console.log(jaT`You are ${age} years old.`)
  console.log(jaT`Welcome to teatag!`)

  console.log('\n=== French (fallback to original) ===')
  const frT = getTranslation('fr')
  console.log(frT`Hello, ${name}!`)
  console.log(frT`You are ${age} years old.`)
  console.log(frT`Welcome to teatag!`)
}

// Run the example
loadTranslations()
demonstrateTranslations()
