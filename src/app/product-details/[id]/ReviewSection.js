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
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

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
        user: { email: user.email }
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

          {/* Tabs */}
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

          {/* Content */}
          <div className="tab-content">
            {tab === 'description' && (
              <div className="tab-pane fade show active">
                <p>{description}</p>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="tab-pane fade show active">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div key={r.id} className="mb-3">
                      <strong>
                        {r.user?.email
                          ? r.user.email.split('@')[0]
                          : 'Anonymous'}
                      </strong>{' '}
                      <span style={{ color: 'gold' }}>
                        {'★'.repeat(r.rating)}
                      </span>
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
                          marginBottom: '10px',
                        }}
                      >
                        {message}
                      </p>
                    )}

                    {/* review text */}
                    <textarea
                      name="text"
                      className="form-control mb-2"
                      placeholder="Write your review..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={4}
                      required
                    />

                    {/* star selector */}
                    <div className="mb-3">
                      <label style={{ display: 'block', marginBottom: '4px' }}>
                        Your rating:
                      </label>
                      <div>
                        {[1,2,3,4,5].map((i) => (
                          <span
                            key={i}
                            onClick={() => setRating(i)}
                            style={{
                              cursor: 'pointer',
                              fontSize: '1.5rem',
                              color: rating >= i ? 'gold' : 'lightgray',
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
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <p>
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