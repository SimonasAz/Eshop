'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const { role } = await res.json();
      router.push(role === 'admin' ? '/admin' : '/');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

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
                  <li><Link href="/login" className="active">Sign In</Link></li>
                </ul>
                <a className="menu-trigger"><span>Menu</span></a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Page Banner */}
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3>Sign In</h3>
              <span className="breadcrumb"><Link href="/">Home</Link> &gt; Sign In</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sign In Form */}
      <div className="section contact-page" style={{ paddingTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="right-content">
                <form onSubmit={handleLogin}>
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
                        placeholder="Your Password"
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
                      <button type="submit" className="orange-button w-100">Sign In</button>
                    </div>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <p>Don&apos;t have an account? <Link href="/register">Register here</Link></p>
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
  );
}
