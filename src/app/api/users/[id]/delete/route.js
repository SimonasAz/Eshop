import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  console.log('DELETE route hit for ID:', params.id)

  const id = parseInt(params.id, 10)
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}