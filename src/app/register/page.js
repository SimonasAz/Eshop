'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.message)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <Link href="/" className="logo">
                  <img src="/assets/images/logo.png" alt="" style={{ width: '158px' }} />
                </Link>
                <ul className="nav">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/shop">Our Shop</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/login">Sign In</Link></li>
                </ul>
                <a className="menu-trigger"><span>Menu</span></a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Page Heading */}
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3>Register</h3>
              <span className="breadcrumb"><Link href="/">Home</Link> &gt; Register</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="section contact-page" style={{ paddingTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="right-content">
                <form onSubmit={handleRegister}>
                  <div className="row">
                    <div className="col-lg-12">
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control mb-4"
                      />
                    </div>
                    <div className="col-lg-12">
                      <input
                        type="password"
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control mb-4"
                      />
                    </div>
                    {error && (
                      <div className="col-lg-12 mb-3">
                        <p style={{ color: 'red' }}>{error}</p>
                      </div>
                    )}
                    <div className="col-lg-12">
                      <button type="submit" className="orange-button w-100">Register</button>
                    </div>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <p>Already have an account? <Link href="/login">Sign in here</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="col-lg-12">
            <p>Copyright © 2048 LUGX Gaming Company. All rights reserved.
              &nbsp;&nbsp;<a rel="nofollow" href="https://templatemo.com" target="_blank">Design: TemplateMo</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
