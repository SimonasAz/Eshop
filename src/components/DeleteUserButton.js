'use client'

import { useRouter } from 'next/navigation'

export default function DeleteUserButton({ userId }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user?')) return

    console.log('Deleting user:', userId)

    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      router.refresh() // or router.push('/admin/users')
    } else {
      const { error } = await res.json()
      alert(`❌ ${error || 'Delete failed'}`)
    }
  }

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-danger"
      onClick={handleDelete}
    >
      Delete
    </button>
  )
}
