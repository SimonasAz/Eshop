import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { cookies } from 'next/headers'

export default async function ProductDetails({ params }) {
  const gameId = parseInt(params.id, 10)

  // fetch game + reviews
  const game = await prisma.game.findUnique({
    where: { id: gameId }
  })
  if (!game) {
    return <p>Game not found.</p>
  }
  const reviews = await prisma.review.findMany({
    where: { gameId },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  // detect logged-in user
  const userCookie = cookies().get('user')
  const user = userCookie ? JSON.parse(userCookie.value) : null

  return (
    <>
      {/* ***** Header Area Start ***** */}
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                {/* ***** Logo Start ***** */}
                <Link href="/" className="logo">
                  <img src="/assets/images/logo.png" alt="" style={{ width: '158px' }} />
                </Link>
                {/* ***** Logo End ***** */}
                {/* ***** Menu Start ***** */}
                <ul className="nav">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/shop">Our Shop</Link></li>
                  <li><Link href={`/product-details/${gameId}`} className="active">Product Details</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/login">Sign In</Link></li>
                </ul>
                <a href="#" className="menu-trigger"><span>Menu</span></a>
                {/* ***** Menu End ***** */}
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* ***** Header Area End ***** */}

      {/* ***** Page Heading ***** */}
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

      {/* ***** Single Product ***** */}
      <div className="single-product section">
        <div className="container">
          <div className="row">
            {/* Image */}
            <div className="col-lg-6">
              <div className="left-image">
                <img src={game.imageUrl} alt={game.title} className="img-fluid" />
              </div>
            </div>
            {/* Details */}
            <div className="col-lg-6 align-self-center">
              <h4>{game.title}</h4>
              <span className="price">
                {game.discount
                  ? <>
                      <em>${game.price.toFixed(2)}</em> ${ (game.price * (1 - game.discount)).toFixed(2) }
                    </>
                  : `$${game.price.toFixed(2)}`}
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
                  <span>Genre:</span>
                  <Link href={`/shop?category=${game.category}`}>{game.category}</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-12"><div className="sep"></div></div>
          </div>
        </div>
      </div>

      {/* ***** Tabs (Description / Reviews) ***** */}
      <div className="more-info">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tabs-content">
                <div className="row">
                  <div className="nav-wrapper">
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="description-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#description"
                          type="button"
                          role="tab"
                          aria-controls="description"
                          aria-selected="true"
                        >
                          Description
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="reviews-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#reviews"
                          type="button"
                          role="tab"
                          aria-controls="reviews"
                          aria-selected="false"
                        >
                          Reviews ({reviews.length})
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content" id="myTabContent">
                    {/* Description */}
                    <div
                      className="tab-pane fade show active"
                      id="description"
                      role="tabpanel"
                      aria-labelledby="description-tab"
                    >
                      <p>{game.description}</p>
                    </div>

                    {/* Reviews */}
                    <div
                      className="tab-pane fade"
                      id="reviews"
                      role="tabpanel"
                      aria-labelledby="reviews-tab"
                    >
                      {reviews.length
                        ? reviews.map(r => (
                            <div key={r.id} className="mb-3">
                              <strong>{r.user.email}</strong>
                              <p>{r.text}</p>
                            </div>
                          ))
                        : <p>No reviews yet.</p>
                      }

                      {/* Review Form */}
                      {user
                        ? (
                          <form
                            action={`/product-details/${gameId}/review`}
                            method="POST"
                            className="mt-4"
                          >
                            <textarea
                              name="text"
                              className="form-control mb-2"
                              placeholder="Write your review..."
                              required
                            />
                            <button type="submit" className="btn btn-primary">
                              Submit Review
                            </button>
                          </form>
                        )
                        : <p><Link href="/login">Log in</Link> to write a review.</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

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