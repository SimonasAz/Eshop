import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DeleteUserButton from '@/components/DeleteUserButton'

export default async function AdminUserList() {
  
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')

  const user = userCookie ? JSON.parse(userCookie.value) : null
  if (!user || user.role !== 'ADMIN') redirect('/')

  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    include: { reviews: true },
  })

  return (
    <>
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3>Manage Users</h3>
              <span className="breadcrumb"><Link href="/">Home</Link> &gt; Admin &gt; Users</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section trending">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-12">
              <h4 className="mb-3"><i className="fa fa-users text-primary me-2"></i> Admin: User Management</h4>
              <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Reviews</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={u.id} style={{ background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge bg-${u.role === 'ADMIN' ? 'warning' : 'info'} text-dark`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{u.reviews.length}</td>
                        <td>
                          <Link
                            href={`/admin/users/${u.id}/edit`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            <i className="fa fa-pencil"></i> Edit
                          </Link>
                          <DeleteUserButton userId={u.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <Link href="/" className="btn btn-secondary">
                  ← Back to Main Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}