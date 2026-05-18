import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return NextResponse.json(
      { message: 'User not found' },
      { status: 401 }
    )
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return NextResponse.json(
      { message: 'Invalid password' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({
    role: user.role
  })

  response.cookies.set(
    'user',
    JSON.stringify({
      id: user.id,
      role: user.role
    }),
    {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax'
    }
  )

  return response
}