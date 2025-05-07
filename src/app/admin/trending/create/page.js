import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'

export default function CreateTrendingGamePage() {
  async function createTrendingGame(formData) {
    'use server'
    const MAX_SIZE = 2 * 1024 * 1024 
    const title    = formData.get('title').toString()
    const category = formData.get('category').toString()
    const price    = parseFloat(formData.get('price'))
    const discount = parseFloat(formData.get('discount')) || 0

    // file upload or URL
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

    await prisma.trendingGame.create({
      data: { title, category, price, discount, imageUrl }
    })

    revalidatePath('/admin/trending')
    redirect('/admin/trending')
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary">➕ Create New Trending Game</h2>
      <form action={createTrendingGame} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" required />
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
            borderColor: '#ee626b',
            color: 'white'
          }}
        >
          Create Trending Game
        </button>{' '}
        <Link href="/admin/trending" className="btn btn-secondary">
          Cancel
        </Link>
      </form>
    </div>
  )
}