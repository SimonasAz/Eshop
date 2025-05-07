import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
      },
    })

    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Registration error:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}