'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default async function EditUserPage({ params }) {

  const resolvedParams = await params
  const userId = resolvedParams.id
  
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('USER')
  const router = useRouter()

  const fetchUser = async () => {
    const res = await fetch(`/api/users/${userId}`)
    const data = await res.json()
    setEmail(data.email)
    setRole(data.role)
  }

  useState(() => {
    fetchUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    })

    if (res.ok) {
      alert('✅ Updated!')
      router.push('/admin/users')
    } else {
      const { error } = await res.json()
      alert(`❌ ${error}`)
    }
  }

  return (
    <div className="container mt-5">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Role:</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="form-select">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  )
}