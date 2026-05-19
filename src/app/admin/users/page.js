import { prisma } from '@/app/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminUserListClient from '@/components/AdminUserListClient'

export default async function AdminUserList() {

  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')

  const user = userCookie
    ? JSON.parse(userCookie.value)
    : null

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    include: { reviews: true }
  })

  return <AdminUserListClient users={users} />
}