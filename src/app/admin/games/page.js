import { prisma } from '@/app/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminGamesPage() {
  const cookieStore = cookies()
  const userCookie = cookieStore.get('user')

  if (!userCookie) redirect('/login')
  const user = JSON.parse(userCookie.value)
  if (user.role !== 'admin') redirect('/')

  const games = await prisma.game.findMany({ orderBy: { id: 'asc' } })

  return (
    <div className="container" style={{ padding: '60px' }}>
      <h2>Admin: Manage Games</h2>
      <Link href="/admin/games/create">➕ Create New Game</Link>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <strong>{game.title}</strong> - ${game.price} - {game.category}
            <div>
              <Link href={`/admin/games/edit/${game.id}`}>✏️ Edit</Link> |
              <Link href={`/admin/games/delete/${game.id}`}>🗑 Delete</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}