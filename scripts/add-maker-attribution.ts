/**
 * Migration script to add maker attribution to existing products and articles
 * Adds createdBy and updatedBy fields to all existing data
 */

import fs from 'fs'
import path from 'path'

interface MakerInfo {
  email: string
  name: string
}

interface ProductWithMaker {
  id: string
  [key: string]: any
  createdBy?: MakerInfo
  updatedBy?: MakerInfo
  createdAt: string
  updatedAt: string
}

interface ArticleWithMaker {
  id: string
  [key: string]: any
  createdBy?: MakerInfo
  updatedBy?: MakerInfo
  createdAt: string
  updatedAt: string
}

// Default system user for migration
const SYSTEM_MIGRATION_USER: MakerInfo = {
  email: "system@migration",
  name: "System Migration"
}

function addMakerAttributionToProducts() {
  const productsPath = path.join(process.cwd(), 'data', 'products.db.json')

  if (!fs.existsSync(productsPath)) {
    console.log('❌ Products database not found')
    return
  }

  console.log('🔄 Adding maker attribution to products...')

  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))

  if (productsData.products && Array.isArray(productsData.products)) {
    productsData.products = productsData.products.map((product: ProductWithMaker) => {
      // Only add maker fields if they don't exist
      if (!product.createdBy || !product.updatedBy) {
        return {
          ...product,
          createdBy: product.createdBy || SYSTEM_MIGRATION_USER,
          updatedBy: product.updatedBy || SYSTEM_MIGRATION_USER,
          // Preserve existing timestamps or add default
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString()
        }
      }
      return product
    })

    // Update metadata
    if (productsData.metadata) {
      productsData.metadata.lastMigration = new Date().toISOString()
      productsData.metadata.migrationVersion = "1.1.0-maker-attribution"
    }

    // Write back to file
    fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2))
    console.log(`✅ Added maker attribution to ${productsData.products.length} products`)
  }
}

function addMakerAttributionToArticles() {
  const articlesPath = path.join(process.cwd(), 'data', 'articles.db.json')

  if (!fs.existsSync(articlesPath)) {
    console.log('❌ Articles database not found')
    return
  }

  console.log('🔄 Adding maker attribution to articles...')

  const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'))

  if (articlesData.articles && Array.isArray(articlesData.articles)) {
    articlesData.articles = articlesData.articles.map((article: ArticleWithMaker) => {
      // Only add maker fields if they don't exist
      if (!article.createdBy || !article.updatedBy) {
        return {
          ...article,
          createdBy: article.createdBy || SYSTEM_MIGRATION_USER,
          updatedBy: article.updatedBy || SYSTEM_MIGRATION_USER,
          // Preserve existing timestamps or add default
          createdAt: article.createdAt || new Date().toISOString(),
          updatedAt: article.updatedAt || new Date().toISOString()
        }
      }
      return article
    })

    // Update metadata
    if (articlesData.metadata) {
      articlesData.metadata.lastMigration = new Date().toISOString()
      articlesData.metadata.migrationVersion = "1.1.0-maker-attribution"
    }

    // Write back to file
    fs.writeFileSync(articlesPath, JSON.stringify(articlesData, null, 2))
    console.log(`✅ Added maker attribution to ${articlesData.articles.length} articles`)
  }
}

function createBackups() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  // Backup products
  const productsPath = path.join(process.cwd(), 'data', 'products.db.json')
  if (fs.existsSync(productsPath)) {
    const backupPath = path.join(process.cwd(), 'data', `products.db.backup-${timestamp}.json`)
    fs.copyFileSync(productsPath, backupPath)
    console.log(`📁 Created products backup: ${backupPath}`)
  }

  // Backup articles
  const articlesPath = path.join(process.cwd(), 'data', 'articles.db.json')
  if (fs.existsSync(articlesPath)) {
    const backupPath = path.join(process.cwd(), 'data', `articles.db.backup-${timestamp}.json`)
    fs.copyFileSync(articlesPath, backupPath)
    console.log(`📁 Created articles backup: ${backupPath}`)
  }
}

// Main migration function
function runMigration() {
  console.log('🚀 Starting maker attribution migration...')
  console.log('📊 This will add createdBy and updatedBy fields to all products and articles')

  try {
    // Create backups first
    createBackups()

    // Add maker attribution
    addMakerAttributionToProducts()
    addMakerAttributionToArticles()

    console.log('✅ Migration completed successfully!')
    console.log('🔍 All existing items now have maker attribution with "System Migration" as default')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Export types for use in other files
export type { MakerInfo, ProductWithMaker, ArticleWithMaker }

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration()
}

export { runMigration, SYSTEM_MIGRATION_USER }