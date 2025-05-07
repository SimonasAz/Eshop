import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function DeleteTrendingGame({ params }) {
  const game = await prisma.trendingGame.findUnique({
    where: { id: Number(params.id) }
  })
  if (!game) redirect('/admin/trending')

  async function handleDelete() {
    'use server'
    await prisma.trendingGame.delete({ where: { id: game.id } })
    revalidatePath('/admin/trending')
    redirect('/admin/trending')
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-danger">🗑️ Delete Trending Game</h2>
      <p>Are you sure you want to delete <strong>{game.title}</strong>?</p>
      <form action={handleDelete}>
        <button type="submit" className="btn btn-danger me-2">
          Yes, delete
        </button>
        <Link href="/admin/trending" className="btn btn-secondary">
          Cancel
        </Link>
      </form>
    </div>
  )
}