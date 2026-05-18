import { prisma } from '@/app/lib/prisma'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ShopPage({ searchParams }) {

  const resolvedSearchParams = await searchParams
  const page = Math.max(
    1,
    parseInt(resolvedSearchParams.page, 10) || 1
  )
  const pageSize = 40

  const total = await prisma.game.count()
  const totalPages = Math.ceil(total / pageSize)

  const games = await prisma.game.findMany({
    orderBy: { id: 'asc' },
    skip:  (page - 1) * pageSize,
    take:  pageSize,
  })

  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  const user = userCookie ? JSON.parse(userCookie.value) : null
  const isAdmin  = user?.role === 'ADMIN'

  return (
    <>
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
                  <li><Link href="/shop" className="active">Our Shop</Link></li>                  
                  <li><Link href="/contact">Contact Us</Link></li>
                  {isAdmin && (
                        <li>
                          <Link href="/admin/users">Manage Users</Link>
                        </li>
                      )}
                  <li><Link href="/login">Sign In</Link></li>
                </ul>
                <a href="#" className="menu-trigger"><span>Menu</span></a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3>Our Shop</h3>
              <span className="breadcrumb">
                <Link href="/">Home</Link> / Shop
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section trending">
        <div className="container">
          {isAdmin && (
            <div className="row">
              <div className="col-12 text-center mb-4">
                <Link href="/admin/games/create" className="btn btn-primary">
                  Add New Game
                </Link>
              </div>
            </div>
          )}

          <div className="row trending-box">
            {games.map(game => (
              <div
                key={game.id}
                className="col-lg-3 col-md-6 mb-30 trending-items adv"
              >
                <div className="item">
                  <div className="thumb" style={{ position: 'relative' }}>
                    {isAdmin && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          display: 'flex',
                          gap: '6px',
                          zIndex: 2
                        }}
                      >
                        <Link
                          href={`/admin/games/edit/${game.id}`}
                          className="btn btn-sm btn-light border"
                          title="Edit"
                        >
                          <i className="fa fa-pencil"></i>
                        </Link>
                        <Link
                          href={`/admin/games/delete/${game.id}`}
                          className="btn btn-sm btn-danger"
                          title="Delete"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      </div>
                    )}

                    <Link href={`/product-details/${game.id}`}>
                      <img
                        src={game.imageUrl || '/assets/images/placeholder.png'}
                        alt={game.title}
                      />
                    </Link>


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
                  </div>

                  <div className="down-content">
                    <span className="category">{game.category}</span>
                    <h4>{game.title}</h4>
                    <Link href={`/product-details/${game.id}`}>
                      <i className="fa fa-shopping-bag"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-lg-12">
              <ul className="pagination">
                <li>
                  <Link
                    href={`/shop?page=${Math.max(1, page - 1)}`}
                    className={page === 1 ? 'disabled' : ''}
                  >
                    &lt;
                  </Link>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1}>
                    <Link
                      href={`/shop?page=${i + 1}`}
                      className={page === i + 1 ? 'is_active' : ''}
                    >
                      {i + 1}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/shop?page=${Math.min(totalPages, page + 1)}`}
                    className={page === totalPages ? 'disabled' : ''}
                  >
                    &gt;
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
