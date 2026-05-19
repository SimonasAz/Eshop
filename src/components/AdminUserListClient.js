'use client'

import { useState } from 'react'
import Link from 'next/link'
import DeleteUserButton from '@/components/DeleteUserButton'

export default function AdminUserListClient({ users }) {

  const [editingId, setEditingId] = useState(null)
  const [editedEmail, setEditedEmail] = useState('')
  const [editedRole, setEditedRole] = useState('USER')

  const startEditing = (user) => {
    setEditingId(user.id)
    setEditedEmail(user.email)
    setEditedRole(user.role)
  }

  const saveUser = async (id) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: editedEmail,
        role: editedRole
      })
    })

    if (res.ok) {
      location.reload()
    } else {
      alert('❌ Failed to update user')
    }
  }

  return (
    <>
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3>Manage Users</h3>
              <span className="breadcrumb">
                <Link href="/">Home</Link> &gt; Admin &gt; Users
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section trending">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-12">

              <h4 className="mb-3">
                <i className="fa fa-users text-primary me-2"></i>
                Admin: User Management
              </h4>

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

                      <tr
                        key={u.id}
                        style={{
                          background: idx % 2 === 0 ? '#fafafa' : 'white'
                        }}
                      >

                        <td>{u.id}</td>

                        <td>
                          {editingId === u.id ? (
                            <input
                              value={editedEmail}
                              onChange={(e) => setEditedEmail(e.target.value)}
                              className="form-control"
                            />
                          ) : (
                            u.email
                          )}
                        </td>

                        <td>
                          {editingId === u.id ? (
                            <select
                              value={editedRole}
                              onChange={(e) => setEditedRole(e.target.value)}
                              className="form-select"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          ) : (
                            <span
                              className={`badge bg-${
                                u.role === 'ADMIN'
                                  ? 'warning'
                                  : 'info'
                              } text-dark`}
                            >
                              {u.role}
                            </span>
                          )}
                        </td>

                        <td>{u.reviews.length}</td>

                        <td>

                          {editingId === u.id ? (
                            <>
                              <button
                                onClick={() => saveUser(u.id)}
                                className="btn btn-sm btn-success me-2"
                              >
                                Save
                              </button>

                              <button
                                onClick={() => setEditingId(null)}
                                className="btn btn-sm btn-secondary"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(u)}
                                className="btn btn-sm btn-outline-primary me-2"
                              >
                                <i className="fa fa-pencil"></i> Edit
                              </button>

                              <DeleteUserButton userId={u.id} />
                            </>
                          )}

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