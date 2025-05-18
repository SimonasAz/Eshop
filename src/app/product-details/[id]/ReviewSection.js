'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ReviewSection({ gameId, description, initialReviews, user }) {
  const [tab, setTab] = useState('description')
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    const formData = new FormData()
    formData.append('text', text)

    const res = await fetch(`/product-details/${gameId}/review`, {
      method: 'POST',
      body: formData
    })

    const result = await res.json()

    if (res.ok) {
      setText('')
      setMessage('✅ Your review has been added.')
      setMessageType('success')
      router.refresh()
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
              <button className={`nav-link ${tab === 'description' ? 'active' : ''}`} onClick={() => setTab('description')}>Description</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>Reviews ({initialReviews.length})</button>
            </li>
          </ul>

          <div className="tab-content">
            {tab === 'description' && (
              <div className="tab-pane fade show active">
                <p>{description}</p>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="tab-pane fade show active">
                {initialReviews.length > 0 ? (
                  initialReviews.map((r) => (
                    <div key={r.id} className="mb-3">
                      <strong>{r.user.email.split('@')[0]}</strong>
                      <p>{r.text}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}

                {user ? (
                  <form onSubmit={handleSubmit} className="mt-4">
                    {message && (
                      <p
                        style={{
                          color: messageType === 'success' ? 'green' : 'red',
                          fontWeight: 500,
                          marginBottom: '10px'
                        }}
                      >
                        {message}
                      </p>
                    )}
                    <textarea
                      name="text"
                      className="form-control mb-2"
                      placeholder="Write your review..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <p><Link href="/login">Log in</Link> to write a review.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}