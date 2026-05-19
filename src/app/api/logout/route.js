import { serialize } from 'cookie'
import { NextResponse } from 'next/server'

export async function POST() {

  const response = NextResponse.redirect(
    new URL('/', 'http://localhost:3000')
  )

  response.headers.set(
    'Set-Cookie',
    serialize('user', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0)
    })
  )

  return response
}