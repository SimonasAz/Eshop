import { prisma }  from '@/app/lib/prisma'
import { cookies } from 'next/headers'
import Link        from 'next/link'
import ReviewSection from './ReviewSection'

export default async function ProductDetails({ params }) {
  const gameId = parseInt(params.id, 10)
  const game   = await prisma.game.findUnique({ where: { id: gameId } })
  if (!game) return <p>Game not found.</p>

  const reviews = await prisma.review.findMany({
    where: { gameId },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  // Read logged-in user from cookie
  const userCookie = cookies().get('user')
  const user = userCookie ? JSON.parse(userCookie.value) : null
  const isAdmin = user?.role === 'ADMIN'

  return (
    <>
      {/* ===== Header ===== */}
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <Link href="/" className="logo">
                  <img src="/assets/images/logo.png" alt="Logo" style={{ width: 158 }} />
                </Link>
                <ul className="nav">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/shop">Our Shop</Link></li>
                  <li>
                    <Link href={`/product-details/${gameId}`} className="active">
                      Product Details
                    </Link>
                  </li>
                  {isAdmin && (
                        <li>
                          <Link href="/admin/users">Manage Users</Link>
                        </li>
                      )}
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/login">Sign In</Link></li>
                </ul>
                <a href="#" className="menu-trigger"><span>Menu</span></a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Page Heading ===== */}
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3>{game.title}</h3>
              <span className="breadcrumb">
                <Link href="/">Home</Link> &gt; <Link href="/shop">Shop</Link> &gt; {game.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Single Product ===== */}
      <div className="single-product section">
        <div className="container">
          <div className="row">
            {/* Left: Image */}
            <div className="col-lg-6">
              <div className="left-image">
                  <img
                    src={game.imageUrl || '/assets/images/placeholder.png'}
                    alt={game.title}
                    style={{
                      width: '150%',
                      height: '500px', // or adjust based on your design
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 0 12px rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
            </div>

            {/* Right: Details */}
            <div className="col-lg-6 align-self-center">
              <h4>{game.title}</h4>
              <span className="price">
                {game.discount ? (
                  <>
                    <em>${game.price.toFixed(2)}</em>{' '}
                    ${(game.price * (1 - game.discount)).toFixed(2)}
                  </>
                ) : (
                  `$${game.price.toFixed(2)}`
                )}
              </span>
              <p>{game.description}</p>
              <form id="number" action="#">
                <input
                  type="number"
                  className="form-control"
                  placeholder="1"
                  defaultValue={1}
                />
                <button type="submit">
                  <i className="fa fa-shopping-bag"></i> ADD TO CART
                </button>
              </form>
              <ul>
                <li><span>Game ID:</span> {game.id}</li>
                <li>
                  <span>Genre:</span>{' '}
                  <Link href={`/shop?category=${encodeURIComponent(game.category)}`}>
                    {game.category}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Separator */}
            <div className="col-lg-12">
              <div className="sep"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Description / Reviews Tabs ===== */}
      <ReviewSection
        gameId={gameId}
        postUrl={`/api/games/${gameId}/reviews`}   /* ← new prop */
        description={game.description}
        initialReviews={reviews}
        user={user}
      />

      {/* ===== Footer ===== */}
      <footer>
        <div className="container">
          <div className="col-lg-12">
            <p>
              Copyright © 2048 LUGX Gaming Company. All rights reserved.
              &nbsp;&nbsp;
              <Link href="https://templatemo.com" target="_blank" rel="nofollow">
                Design: TemplateMo
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}