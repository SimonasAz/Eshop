import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  
  const resolvedParams = await params
  const reviewId = parseInt(resolvedParams.id, 10)
  
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  const user = userCookie && JSON.parse(userCookie.value)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  })

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 })
  }

  if (user.role !== 'ADMIN' && review.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.review.delete({ where: { id: reviewId } })

  return NextResponse.json({ success: true })
}

export async function PUT(request, { params }) {
  
  const resolvedParams = await params
  const reviewId = parseInt(resolvedParams.id, 10)
  const body = await request.json()
  const { text: rawText, rating: rawRating } = body
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  const user = userCookie && JSON.parse(userCookie.value)

  if (!user || !rawText || !rawRating) {
    return NextResponse.json({ error: 'Unauthorized or missing fields' }, { status: 400 })
  }

  const text = rawText.toString().trim()
  const rating = parseInt(rawRating.toString(), 10)

  if (text.length < 5 || text.length > 1000) {
    return NextResponse.json({ error: 'Review text must be 5–1000 characters.' }, { status: 400 })
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 })
  }

  const review = await prisma.review.findUnique({ where: { id: reviewId } })

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 })
  }

  if (review.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: { text, rating },
  })

  return NextResponse.json({ success: true, review: updatedReview })
}