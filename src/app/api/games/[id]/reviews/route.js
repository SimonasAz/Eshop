import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  
  const resolvedParams = await params
  const gameId     = parseInt(resolvedParams.id, 10)
  const form       = await request.formData()
  const rawText    = form.get('text')
  const rawRating  = form.get('rating')
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  const user       = userCookie && JSON.parse(userCookie.value)

  if (!user || !rawText || !rawRating) {
    return NextResponse.json(
      { error: 'Unauthorized or missing fields' },
      { status: 400 }
    )
  }

  const text   = rawText.toString().trim()
  const rating = parseInt(rawRating.toString(), 10)

  if (text.length < 5) {
    return NextResponse.json(
      { error: 'Review must be at least 5 characters.' },
      { status: 400 }
    )
  }
  if (text.length > 1000) {
    return NextResponse.json(
      { error: 'Review must be at most 1000 characters.' },
      { status: 400 }
    )
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'Rating must be an integer between 1 and 5.' },
      { status: 400 }
    )
  }

  const exists = await prisma.review.findFirst({
    where: { userId: user.id, gameId, text }
  })
  if (exists) {
    return NextResponse.json(
      { error: 'Duplicate review not allowed.' },
      { status: 409 }
    )
  }

  await prisma.review.create({
    data: { text, rating, userId: user.id, gameId }
  })

  return NextResponse.json({ success: true })
}
