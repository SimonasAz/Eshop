import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

export default function CreateGamePage() {
  async function createGame(formData) {
    'use server'

    const MAX_SIZE = 2 * 1024 * 1024
    const title       = formData.get('title')
    const description = formData.get('description')
    const category    = formData.get('category')
    const price       = parseFloat(formData.get('price'))
    const discount    = parseFloat(formData.get('discount')) || 0

    // first see if they uploaded a file
    let imageUrl = formData.get('imageUrl')?.toString() || ''
    const file = formData.get('imageFile')
    if (file && file.size > 0) {
      if (file.size > MAX_SIZE) {
        throw new Error('Uploaded file must be under 2 MB')
      }
      const buffer   = Buffer.from(await file.arrayBuffer())
      const filename = `${Date.now()}-${file.name}`
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
      await fs.promises.writeFile(filepath, buffer)
      imageUrl = `/uploads/${filename}`
    }

    await prisma.game.create({
      data: { title, description, category, price, discount, imageUrl }
    })

    revalidatePath('/admin/games')
    redirect('/admin/games')
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary">➕ Create New Game</h2>
      <form action={createGame}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" rows="3" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input name="category" className="form-control" required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price</label>
            <input name="price" type="number" step="0.01" className="form-control" required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Discount</label>
            <input name="discount" type="number" step="0.01" className="form-control" />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input name="imageUrl" type="url" className="form-control" placeholder="http://…" />
        </div>
        <div className="mb-4">
          <label className="form-label">Or upload file</label>
          <input name="imageFile" type="file" accept="image/*" className="form-control" />
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            backgroundColor: '#ee626b',
            borderColor:     '#ee626b',
            color:           'white'
          }}
        >
          Create Game
        </button>
      </form>
    </div>
  )
}