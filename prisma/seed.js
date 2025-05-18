import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // 1) Admin user upsert
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created')

  // 2) Seed trending games
  const trendingGames = [
    { title: "Assassin's Creed Mirage", category: 'Action', price: 49.99, discount: 0.2, imageUrl: '/assets/images/trending-01.jpg' },
    { title: 'Final Fantasy XVI',       category: 'RPG',    price: 59.99, discount: 0.15, imageUrl: '/assets/images/trending-02.jpg' },
    { title: 'Cyberpunk 2077',          category: 'Adventure', price: 39.99, discount: 0.3, imageUrl: '/assets/images/trending-03.jpg' },
    { title: 'Elden Ring',              category: 'Action', price: 69.99, discount: 0.1, imageUrl: '/assets/images/trending-04.jpg' },
  ]
  await prisma.trendingGame.createMany({ data: trendingGames })
  console.log('✅ Seeded trending games')

  // 3) Seed shop games
  const categories = ['Action','Adventure','RPG','Shooter','Strategy','Simulation','Sports','Racing']
  const fakeGames = Array.from({ length: 100 }).map(() => {
    const price    = parseFloat(faker.commerce.price(5, 100, 2))
    // 30% chance of a discount
    const discount = Math.random() < 0.3
      ? parseFloat((Math.random() * 0.5).toFixed(2))
      : 0
    return {
      title:       faker.commerce.productName(),
      description: faker.lorem.sentences(2),
      category:    faker.helpers.arrayElement(categories),
      price,
      discount,
      imageUrl:    faker.image.url(640, 480, { category: 'games' }), 
    }
  })

  await prisma.game.createMany({ data: fakeGames })
  console.log(`✅ Seeded ${fakeGames.length} shop games`)

  // 4) Seed regular users
const userCount = 5
const users = []
for (let i = 0; i < userCount; i++) {
  const password = await bcrypt.hash('user123', 10)
  const user = await prisma.user.create({
    data: {
      email: `user${i + 1}@example.com`,
      password,
      role: 'USER',
    },
  })
  users.push(user)
}
console.log(`✅ Created ${userCount} regular users`)
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
