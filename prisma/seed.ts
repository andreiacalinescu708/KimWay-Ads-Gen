import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default app settings
  await prisma.appSettings.upsert({
    where: { id: 'settings' },
    update: {},
    create: {
      id: 'settings',
      videoGenerationCost: 10,
      videoRegenerationCost: 5,
      editScriptRegenerateCost: 8,
      freeGenerationEnabled: true,
    },
  })

  // Create default token packages
  const packages = [
    {
      name: 'Starter',
      description: 'Perfect pentru început',
      price: 999, // €9.99
      tokenAmount: 50,
      stripePriceId: 'price_starter_placeholder',
    },
    {
      name: 'Pro',
      description: 'Cel mai popular',
      price: 2499, // €24.99
      tokenAmount: 150,
      stripePriceId: 'price_pro_placeholder',
    },
    {
      name: 'Enterprise',
      description: 'Pentru echipe mari',
      price: 9999, // €99.99
      tokenAmount: 700,
      stripePriceId: 'price_enterprise_placeholder',
    },
  ]

  for (const pkg of packages) {
    await prisma.tokenPackage.upsert({
      where: { stripePriceId: pkg.stripePriceId },
      update: {},
      create: pkg,
    })
  }

  console.log('✅ Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
