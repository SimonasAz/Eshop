import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const id = parseInt(params.id, 10)
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PUT(request, { params }) {
  const id = parseInt(params.id, 10)
  const { email, role } = await request.json()

  if (!email || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { email, role },
  })

  return NextResponse.json(updated)
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id, 10)

  try {
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'User not found or already deleted' },
      { status: 404 }
    )
  }
}
