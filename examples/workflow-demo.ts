#!/usr/bin/env node

// Complete workflow demonstration
import { addLocale, getTranslation } from '../dist/index.js'
import * as fs from 'fs'
import { execSync } from 'child_process'

console.log('🎯 Teatag Complete Workflow Demo\n')

// Step 1: Define sample application with translatable strings
console.log('📝 Step 1: Writing application code with t`` tags...')

const sampleApp = `
import { getTranslation } from 'teatag'

function welcomeUser(locale: string, userName: string, itemCount: number) {
  const t = getTranslation(locale)
  
  console.log(t\`Welcome to our store, \${userName}!\`)
  console.log(t\`You have \${itemCount} items in your cart.\`)
  console.log(t\`Thank you for shopping with us!\`)
  
  if (itemCount > 0) {
    console.log(t\`Proceed to checkout\`)
  } else {
    console.log(t\`Continue shopping\`)
  }
}
`

fs.writeFileSync('./demo-app.ts', sampleApp)
console.log('✅ Sample app written to demo-app.ts\n')

// Step 2: Extract strings
console.log('🔍 Step 2: Extracting translatable strings...')
try {
  execSync('node ../dist/cli.js extract --lang es --src . --out ./demo-locales', { 
    stdio: 'inherit',
    cwd: process.cwd()
  })
  console.log('✅ Strings extracted to demo-locales/es.yaml\n')
} catch (error) {
  console.error('❌ Failed to extract strings:', error)
  process.exit(1)
}

// Step 3: Show extracted file
console.log('📋 Step 3: Showing extracted strings...')
const extractedContent = fs.readFileSync('./demo-locales/es.yaml', 'utf-8')
console.log('Contents of demo-locales/es.yaml:')
console.log(extractedContent)

// Step 4: Add translations
console.log('🌍 Step 4: Adding Spanish translations...')
const spanishTranslations = `Welcome to our store, \${name}!: '¡Bienvenido a nuestra tienda, \${name}!'
You have \${name} items in your cart.: 'Tienes \${name} artículos en tu carrito.'
Thank you for shopping with us!: '¡Gracias por comprar con nosotros!'
Proceed to checkout: 'Proceder al pago'
Continue shopping: 'Continuar comprando'`

fs.writeFileSync('./demo-locales/es.yaml', spanishTranslations)
console.log('✅ Spanish translations added\n')

// Step 5: Demonstrate usage
console.log('🚀 Step 5: Demonstrating translations in action...')

// Load the translations
const esYaml = fs.readFileSync('./demo-locales/es.yaml', 'utf-8')
addLocale('es', esYaml)

function demoWelcomeUser(locale: string, userName: string, itemCount: number) {
  const t = getTranslation(locale)
  
  console.log(`--- ${locale.toUpperCase()} ---`)
  console.log(t`Welcome to our store, ${userName}!`)
  console.log(t`You have ${itemCount} items in your cart.`)
  console.log(t`Thank you for shopping with us!`)
  
  if (itemCount > 0) {
    console.log(t`Proceed to checkout`)
  } else {
    console.log(t`Continue shopping`)
  }
  console.log()
}

// Demo with different users and locales
demoWelcomeUser('en', 'Maria', 3)
demoWelcomeUser('es', 'Maria', 3)
demoWelcomeUser('en', 'Carlos', 0)
demoWelcomeUser('es', 'Carlos', 0)

// Step 6: Cleanup
console.log('🧹 Step 6: Cleaning up demo files...')
fs.unlinkSync('./demo-app.ts')
fs.rmSync('./demo-locales', { recursive: true, force: true })
console.log('✅ Demo files cleaned up')

console.log('\n🎉 Teatag workflow demo completed!')
console.log('\nKey takeaways:')
console.log('- Use t`${variable}` syntax in your code')
console.log('- Run `teatag extract --lang <locale>` to extract strings')
console.log('- Translate the generated YAML files')
console.log('- Load translations with addLocale() and use with getTranslation()')
console.log('- Automatic fallback to original strings when translation missing')