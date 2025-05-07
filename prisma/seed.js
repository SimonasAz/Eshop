import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
  const shopGames = [
    { title: 'The Witcher 3: Wild Hunt', description: 'An epic RPG adventure…', price: 29.99, discount: 0.25, category: 'RPG',     imageUrl: '/assets/images/top-game-01.jpg' },
    { title: 'Forza Horizon 5',          description: 'Open-world racing…',    price: 59.99, discount: 0.2,  category: 'Racing',  imageUrl: '/assets/images/top-game-02.jpg' },
    { title: 'Minecraft',                 description: 'Create, explore…',      price: 26.95, discount: 0,    category: 'Adventure', imageUrl: '/assets/images/top-game-03.jpg' },
    { title: 'Valorant',                  description: 'Tactical shooter…',     price: 0.0,   discount: 0,    category: 'Shooter',  imageUrl: '/assets/images/top-game-04.jpg' },
    { title: 'Grand Theft Auto V',        description: 'Open-world epic…',       price: 19.99, discount: 0.5,  category: 'Action',   imageUrl: '/assets/images/top-game-05.jpg' },
    { title: 'League of Legends',         description: 'Popular MOBA…',          price: 0.0,   discount: 0,    category: 'Strategy', imageUrl: '/assets/images/top-game-06.jpg' },
  ]
  await prisma.game.createMany({ data: shopGames })
  console.log('✅ Seeded shop games')
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })