import { prisma } from '@/app/lib/prisma' 
import bcrypt from 'bcryptjs'
import { serialize } from 'cookie'

export async function POST(req) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return new Response(JSON.stringify({ message: 'Invalid password' }), { status: 401 })
  }

  const cookie = serialize('user', JSON.stringify({ id: user.id, role: user.role }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  })

  return new Response(JSON.stringify({ role: user.role }), {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  })
}