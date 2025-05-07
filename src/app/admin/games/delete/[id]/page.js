import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function DeleteGame({ params }) {
  const game = await prisma.game.findUnique({ where: { id: Number(params.id) } })
  if (!game) redirect('/admin/games')

  async function handleDelete() {
    'use server'
    await prisma.game.delete({ where: { id: game.id } })
    revalidatePath('/admin/games')
    redirect('/admin/games')
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h2 className="text-danger mb-4">🗑️ Delete Game</h2>
          <p>Are you sure you want to delete <strong>{game.title}</strong>?</p>
          <form action={handleDelete} className="d-flex justify-content-center gap-3 mt-4">
            <button type="submit" className="btn btn-danger">Yes, delete</button>
            <a href="/admin/games" className="btn btn-secondary">Cancel</a>
          </form>
        </div>
      </div>
    </div>
  )
}