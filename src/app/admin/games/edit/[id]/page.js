import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

export default async function EditGame({ params }) {
  const game = await prisma.game.findUnique({
    where: { id: Number(params.id) }
  })
  if (!game) {
    redirect('/admin/games')
  }

  async function handleEdit(formData) {
    'use server'
    const MAX_SIZE = 2 * 1024 * 1024

    const title       = formData.get('title')
    const description = formData.get('description')
    const category    = formData.get('category')
    const price       = parseFloat(formData.get('price'))
    const discount    = parseFloat(formData.get('discount')) || 0

    // ─── VALIDATIONS ──────────────────────────────────────────────────────
    if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 100) {
      throw new Error('Title must be a string between 3 and 100 characters.')
    }
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters long.')
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

    // ─── IMAGE URL & FILE ─────────────────────────────────────────────────
    let imageUrl = game.imageUrl

    const inputImageUrl = formData.get('imageUrl')?.toString().trim()
    if (inputImageUrl) {
      try {
        // Try parsing as absolute URL
        const url = new URL(inputImageUrl)
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          imageUrl = inputImageUrl
        } else {
          throw new Error()
        }
      } catch {
        // Fallback to relative path
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
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, or WEBP images are allowed.')
      }
      const buffer   = Buffer.from(await file.arrayBuffer())
      const filename = `${Date.now()}-${file.name}`
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
      await fs.promises.writeFile(filepath, buffer)
      imageUrl = `/uploads/${filename}`
    }

    // ─── DATABASE UPDATE
    await prisma.game.update({
      where: { id: game.id },
      data: {
        title:       title.trim(),
        description: description.trim(),
        category:    category.trim(),
        price,
        discount,
        imageUrl
      }
    })

    revalidatePath('/shop')
    redirect('/shop')
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary">✏️ Edit Game</h2>
      <form action={handleEdit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" defaultValue={game.title} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            rows="3"
            defaultValue={game.description}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input name="category" defaultValue={game.category} className="form-control" required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={game.price}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Discount</label>
            <input
              name="discount"
              type="number"
              step="0.01"
              defaultValue={game.discount ?? 0}
              className="form-control"
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            name="imageUrl"
            type="text"
            defaultValue={game.imageUrl}
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
          style={{ backgroundColor: '#ee626b', borderColor: '#ee626b', color: 'white' }}
        >
          Update Game
        </button>{' '}
        <Link href="/admin/games" className="btn btn-secondary">Cancel</Link>
      </form>
    </div>
  )
}
