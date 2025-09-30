// Migration script to create unified database
import fs from "fs"
import path from "path"
import { PRODUCTS } from "../data/products"
import { KNIVES } from "../data/knives"
import { TOOLS } from "../data/tools"
import { UnifiedProduct, normalizeProduct } from "../data/unified-products"

function migrateToUnified() {
  const unifiedProducts: UnifiedProduct[] = []

  // Migrate existing products from products.ts
  console.log("Migrating legacy products...")
  PRODUCTS.forEach((product) => {
    const unified = normalizeProduct({
      ...product,
      // Convert old structure to new
      bladeLengthCm: product.bladeLength,
      handleLengthCm: product.handleLength,
      images: [product.image],
    })
    unifiedProducts.push(unified)
    console.log(`  ✓ Migrated product: ${product.title}`)
  })

  // Migrate knives from knives.ts
  console.log("\nMigrating knives...")
  KNIVES.forEach((knife) => {
    const unified = normalizeProduct({
      ...knife,
      type: "knife",
    })
    unifiedProducts.push(unified)
    console.log(`  ✓ Migrated knife: ${knife.title}`)
  })

  // Migrate tools from tools.ts
  console.log("\nMigrating tools...")
  TOOLS.forEach((tool) => {
    const unified = normalizeProduct({
      ...tool,
      type: "tool",
      bladeLengthCm: tool.bladeLengthCm,
      handleLengthCm: tool.handleLengthCm,
    })
    unifiedProducts.push(unified)
    console.log(`  ✓ Migrated tool: ${tool.title}`)
  })

  // Create unified database
  const dbPath = path.join(process.cwd(), "data", "products.db.json")
  const unifiedDb = {
    products: unifiedProducts,
    metadata: {
      version: "2.0",
      createdAt: new Date().toISOString(),
      totalProducts: unifiedProducts.length,
      productTypes: {
        knives: unifiedProducts.filter(p => p.type === "knife").length,
        tools: unifiedProducts.filter(p => p.type === "tool").length,
      }
    }
  }

  // Backup existing database
  if (fs.existsSync(dbPath)) {
    const backupPath = dbPath.replace(".json", `.backup-${Date.now()}.json`)
    fs.copyFileSync(dbPath, backupPath)
    console.log(`\n📦 Backed up existing database to: ${backupPath}`)
  }

  // Write unified database
  fs.writeFileSync(dbPath, JSON.stringify(unifiedDb, null, 2), "utf8")
  console.log(`\n✅ Created unified database: ${dbPath}`)
  console.log(`   Total products: ${unifiedProducts.length}`)
  console.log(`   Knives: ${unifiedDb.metadata.productTypes.knives}`)
  console.log(`   Tools: ${unifiedDb.metadata.productTypes.tools}`)

  return unifiedDb
}

// Run migration if called directly
if (require.main === module) {
  migrateToUnified()
}

export { migrateToUnified }