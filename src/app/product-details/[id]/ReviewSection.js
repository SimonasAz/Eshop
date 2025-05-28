'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ReviewSection({
  gameId,
  postUrl,
  description,
  initialReviews,
  user,
}) {
  const [tab, setTab] = useState('description')
  const [reviews, setReviews] = useState(initialReviews)
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const router = useRouter()

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' })
    const result = await res.json()

    if (res.ok) {
      setReviews(reviews.filter((r) => r.id !== reviewId))
      setMessage('✅ Review deleted.')
      setMessageType('success')
    } else {
      setMessage(`❌ ${result.error || 'Failed to delete review.'}`)
      setMessageType('error')
    }
  }

  const handleEdit = (review) => {
    setText(review.text)
    setRating(review.rating)
    setEditingReviewId(review.id)
    setEditMode(true)
    setTab('reviews')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (editMode && editingReviewId) {
      const res = await fetch(`/api/reviews/${editingReviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, rating }),
      })
      const result = await res.json()

      if (res.ok) {
        setReviews(reviews.map((r) =>
          r.id === editingReviewId ? { ...r, text, rating } : r
        ))
        setMessage('✅ Review updated.')
        setMessageType('success')
      } else {
        setMessage(`❌ ${result.error || 'Update failed.'}`)
        setMessageType('error')
      }

      setEditMode(false)
      setEditingReviewId(null)
      setText('')
      setRating(5)
      return
    }

    const formData = new FormData()
    formData.append('text', text)
    formData.append('rating', rating.toString())

    const res = await fetch(postUrl, {
      method: 'POST',
      body: formData,
    })
    const result = await res.json()

    if (res.ok) {
      setReviews([{
        id: Date.now(),
        text,
        rating,
        user: { email: user.email, id: user.id },
      }, ...reviews])

      setText('')
      setRating(5)
      setMessage('✅ Your review has been added.')
      setMessageType('success')
      setTab('reviews')
    } else {
      setMessage(`❌ ${result.error || 'Review failed.'}`)
      setMessageType('error')
    }
  }

  return (
    <div className="more-info">
      <div className="container">
        <div className="tabs-content">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'description' ? 'active' : ''}`}
                onClick={() => setTab('description')}
              >
                Description
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'reviews' ? 'active' : ''}`}
                onClick={() => setTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {tab === 'description' && (
              <div className="tab-pane fade show active">
                <p>{description}</p>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="tab-pane fade show active mt-4">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 mb-3 rounded shadow-sm"
                      style={{ background: '#f9f9f9' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong>{r.user?.email?.split('@')[0] || 'Anonymous'}</strong>
                        <div>
                          {user?.id === r.user?.id && (
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(r)}
                            >
                              Edit
                            </button>
                          )}
                          {user?.role === 'ADMIN' && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(r.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{ color: 'gold' }}>{'★'.repeat(r.rating)}</div>
                      <p className="mb-0">{r.text}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}

                {user ? (
                  <form
                    onSubmit={handleSubmit}
                    className="mt-4 p-4 rounded shadow-sm"
                    style={{
                      background: editMode ? '#fff8dc' : '#fff',
                      border: editMode ? '2px solid #ffc107' : '1px solid #eaeaea',
                    }}
                  >
                    {editMode && (
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold text-warning">
                          📝 Editing your review
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => {
                            setEditMode(false)
                            setEditingReviewId(null)
                            setText('')
                            setRating(5)
                            setMessage('')
                          }}
                        >
                          Cancel Edit
                        </button>
                      </div>
                    )}

                    {message && (
                      <div
                        className={`alert ${
                          messageType === 'success' ? 'alert-success' : 'alert-danger'
                        } py-2 px-3`}
                      >
                        {message}
                      </div>
                    )}

                    <textarea
                      name="text"
                      className="form-control mb-3"
                      placeholder="Write your review..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={4}
                      required
                    />

                    <div className="mb-3">
                      <label className="form-label">Your rating:</label>
                      <div>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            onClick={() => setRating(i)}
                            style={{
                              cursor: 'pointer',
                              fontSize: '1.5rem',
                              color: rating >= i ? 'gold' : '#ccc',
                              marginRight: '4px',
                            }}
                            role="button"
                            aria-label={`${i} star`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      {editMode ? 'Update Review' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <p className="mt-3">
                    <Link href="/login">Log in</Link> to write a review.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
