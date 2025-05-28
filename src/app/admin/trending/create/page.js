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

    const title    = formData.get('title')
    const category = formData.get('category')
    const price    = parseFloat(formData.get('price'))
    const discount = parseFloat(formData.get('discount')) || 0

    if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 100) {
      throw new Error('Title must be a string between 3 and 100 characters.')
    }
    if (!category || typeof category !== 'string' || category.trim().length < 3 || category.trim().length > 50) {
      throw new Error('Category must be a string between 3 and 50 characters.')
    }
    if (isNaN(price) || price < 0) {
      throw new Error('Price must be a valid number ≥ 0.')
    }
    if (isNaN(discount) || discount < 0 || discount > 100) {
      throw new Error('Discount must be between 0 and 100.')
    }

    let imageUrl = ''
    const inputImageUrl = formData.get('imageUrl')?.toString().trim()

    if (inputImageUrl) {
      try {

        const url = new URL(inputImageUrl)
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          imageUrl = inputImageUrl
        } else {
          throw new Error()
        }
      } catch {

        if (inputImageUrl.startsWith('/')) {
          imageUrl = inputImageUrl
        } else {
          throw new Error('Image URL must be an absolute HTTP/HTTPS URL or start with "/".')
        }
      }
    }

    const file = formData.get('imageFile')
    if (file && file.size > 0) {
      if (file.size > MAX_SIZE) {
        throw new Error('Uploaded file must be under 2 MB.')
      }
      const allowed = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowed.includes(file.type)) {
        throw new Error('Only JPEG, PNG, or WEBP images are allowed.')
      }
      const buffer   = Buffer.from(await file.arrayBuffer())
      const filename = `${Date.now()}-${file.name}`
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
      await fs.promises.writeFile(filepath, buffer)
      imageUrl = `/uploads/${filename}`
    }

    await prisma.trendingGame.create({
      data: {
        title:    title.trim(),
        category: category.trim(),
        price,
        discount,
        imageUrl
      }
    })

    revalidatePath('/')
    redirect('/')
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary">➕ Create New Trending Game</h2>
      <form action={createTrendingGame}>
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
          <input
            name="imageUrl"
            type="text"
            className="form-control"
            placeholder="http://… or /uploads/…"
          />
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
          Create Trending Game
        </button>{' '}
        <Link href="/admin/trending" className="btn btn-secondary">Cancel</Link>
      </form>
    </div>
  )
}