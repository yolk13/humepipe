import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match) process.env[match[1]] = match[2]
  }
}

const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')

import type { Product } from '../src/payload-types'

type ClassKey = 'NP2' | 'NP3' | 'NP4'
type ProductSeed = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'tdsPdf'>

const seed: Record<ClassKey, ProductSeed[]> = {
  NP2: [
    { productClass: 'NP2', diameter: 150, wallThickness: 25, length: '2.0 / 2.5', weight: '75 / 95', jointType: 'socket-spigot' },
    { productClass: 'NP2', diameter: 250, wallThickness: 30, length: '2.0 / 2.5', weight: '140 / 175', jointType: 'socket-spigot' },
    { productClass: 'NP2', diameter: 300, wallThickness: 35, length: '2.5', weight: '230', jointType: 'socket-spigot' },
    { productClass: 'NP2', diameter: 450, wallThickness: 45, length: '2.5', weight: '420', jointType: 'socket-spigot' },
    { productClass: 'NP2', diameter: 600, wallThickness: 55, length: '2.5', weight: '680', jointType: 'socket-spigot' },
    { productClass: 'NP2', diameter: 900, wallThickness: 75, length: '2.5', weight: '1350', jointType: 'flush' },
    { productClass: 'NP2', diameter: 1200, wallThickness: 100, length: '2.5', weight: '2400', jointType: 'flush' },
  ],
  NP3: [
    { productClass: 'NP3', diameter: 150, wallThickness: 30, length: '2.0 / 2.5', weight: '90 / 110', jointType: 'socket-spigot' },
    { productClass: 'NP3', diameter: 250, wallThickness: 38, length: '2.0 / 2.5', weight: '170 / 210', jointType: 'socket-spigot' },
    { productClass: 'NP3', diameter: 300, wallThickness: 42, length: '2.5', weight: '275', jointType: 'socket-spigot' },
    { productClass: 'NP3', diameter: 450, wallThickness: 55, length: '2.5', weight: '505', jointType: 'socket-spigot' },
    { productClass: 'NP3', diameter: 600, wallThickness: 65, length: '2.5', weight: '800', jointType: 'socket-spigot' },
    { productClass: 'NP3', diameter: 900, wallThickness: 90, length: '2.5', weight: '1580', jointType: 'flush' },
    { productClass: 'NP3', diameter: 1200, wallThickness: 120, length: '2.5', weight: '2800', jointType: 'flush' },
  ],
  NP4: [
    { productClass: 'NP4', diameter: 150, wallThickness: 34, length: '2.0 / 2.5', weight: '105 / 130', jointType: 'socket-spigot' },
    { productClass: 'NP4', diameter: 250, wallThickness: 42, length: '2.0 / 2.5', weight: '190 / 235', jointType: 'socket-spigot' },
    { productClass: 'NP4', diameter: 300, wallThickness: 48, length: '2.5', weight: '320', jointType: 'socket-spigot' },
    { productClass: 'NP4', diameter: 450, wallThickness: 62, length: '2.5', weight: '575', jointType: 'socket-spigot' },
    { productClass: 'NP4', diameter: 600, wallThickness: 75, length: '2.5', weight: '930', jointType: 'socket-spigot' },
    { productClass: 'NP4', diameter: 900, wallThickness: 105, length: '2.5', weight: '1850', jointType: 'flush' },
    { productClass: 'NP4', diameter: 1200, wallThickness: 140, length: '2.5', weight: '3300', jointType: 'flush' },
  ],
}

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'products',
  limit: 100,
  pagination: false,
})
for (const doc of existing.docs) {
  await payload.delete({ collection: 'products', id: doc.id })
}

let count = 0
for (const rows of Object.values(seed)) {
  for (const row of rows) {
    await payload.create({ collection: 'products', data: row })
    count += 1
  }
}

console.log(`Seeded ${count} product rows into collection "products".`)
process.exit(0)
