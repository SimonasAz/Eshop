import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const gameId = parseInt(params.id, 10)
  const form = await request.formData()
  const text = form.get('text')?.toString().trim()
  const userCookie = request.cookies.get('user')
  const user = userCookie && JSON.parse(userCookie.value)

  if (!user || !text) {
    return NextResponse.json({ error: 'Unauthorized or missing text' }, { status: 400 })
  }

  
  const existing = await prisma.review.findFirst({
    where: {
      userId: user.id,
      gameId,
      text,
    }
  })

  if (existing) {
    return NextResponse.json({ error: 'Duplicate review not allowed.' }, { status: 409 })
  }

  await prisma.review.create({
    data: { text, userId: user.id, gameId }
  })

  return NextResponse.json({ success: true })
}