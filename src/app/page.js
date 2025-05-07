import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { cookies } from 'next/headers'

export default async function Home() {
  const trendingGames = await prisma.trendingGame.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4,
  })
  const userCookie = cookies().get('user')
  const user = userCookie ? JSON.parse(userCookie.value) : null
  const isAdmin = user?.role === 'ADMIN'
  return (
    <>

  {/* Header Area Start */}
  <header className="header-area header-sticky">
    <div className="container">
        <div className="row">
            <div className="col-12">
                <nav className="main-nav">
                    {/* Logo Start */}
                    <Link href="/" className="logo">
                        <img src="/assets/images/logo.png" alt="" style={{width: '158px'}}/>
                    </Link>
                    {/* Logo End  */}
                    {/* Menu Start */}
                    <ul className="nav">
                      <li>
                        <Link href="/" className="active">Home</Link>
                      </li>
                      <li><Link href="/shop">Our Shop</Link></li>
                      <li><Link href="/product-details">Product Details</Link></li>
                      <li><Link href="/contact">Contact Us</Link></li>
                      <li><a href="/login">Sign In</a></li>
                  </ul>   
                  <a href="#" className="menu-trigger">
                    <span>Menu</span>
                  </a>
                    {/* Menu End */}
                </nav>
            </div>
        </div>
    </div>
  </header>
  {/* Header Area End */}

  <div className="main-banner">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 align-self-center">
          <div className="caption header-text">
            <h6>Welcome to lugx</h6>
            <h2>BEST E-SHOP WEBSITE</h2>
            <p>LUGX Gaming is a gaming website. Tou can find many of your games on this site</p>
            <div className="search-input">
              <form id="search" action="#">
                <input
                  type="text"
                  placeholder="Type Something"
                  id="searchText"
                  name="searchKeyword"
                />
                <button role="button">Search Now</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4 offset-lg-2">
          <div className="right-image">
            <img src="/assets/images/banner-image.jpg" alt=""/>
            <span className="price">$22</span>
            <span className="offer">-40%</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="features">
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-md-6">
          <Link href="#">
            <div className="item">
              <div className="image">
                <img src="/assets/images/featured-01.png" alt="" style={{ maxWidth: '44px' }}/>
              </div>
              <h4>Free Storage</h4>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-md-6">
          <Link href="#">
            <div className="item">
              <div className="image">
                <img src="/assets/images/featured-02.png" alt="" style={{ maxWidth: '44px' }}/>
              </div>
              <h4>User More</h4>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-md-6">
          <Link href="#">
            <div className="item">
              <div className="image">
                <img src="/assets/images/featured-03.png" alt="" style={{ maxWidth: '44px' }}/>
              </div>
              <h4>Reply Ready</h4>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-md-6">
          <Link href="#">
            <div className="item">
              <div className="image">
                <img src="/assets/images/featured-04.png" alt="" style={{ maxWidth: '44px' }}/>
              </div>
              <h4>Easy Layout</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>

  <div className="section trending">
  <div className="container">
    <div className="row">
      <div className="col-lg-6">
        <div className="section-heading">
          <h6>Trending</h6>
          <h2>Trending Games</h2>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="main-button">
          <Link href="/shop">View All</Link>
        </div>
      </div>

      {/* Dynamic Trending Games */}
      {trendingGames.map(game => (
        <div key={game.id} className="col-lg-3 col-md-6">
          <div className="item">
            <div className="thumb" style={{ position: 'relative' }}>
              {isAdmin && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 2
                }}>
                  <Link
                    href={`/admin/trending/edit/${game.id}`}
                    className="btn btn-sm btn-light border"
                  >
                    <i className="fa fa-pencil"></i>
                  </Link>
                  <Link
                    href={`/admin/trending/delete/${game.id}`}
                    className="btn btn-sm btn-danger"
                  >
                    <i className="fa fa-trash"></i>
                  </Link>
                </div>
              )}
              <Link href={`/product-details/${game.id}`}>
                <img src={game.imageUrl || '/assets/images/placeholder.png'} alt={game.title} />
              </Link>

              <span className="price">
                {game.discount ? (
                  <>
                    <em>${game.price.toFixed(2)}</em> ${(game.price * (1 - game.discount)).toFixed(2)}
                  </>
                ) : `$${game.price.toFixed(2)}`}
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

    {/* Only show this once under the trending games if Admin */}
    {isAdmin && (
      <div className="row">
        <div className="col-12 text-center" style={{ marginTop: '30px' }}>
          <Link href="/admin/trending/create" className="btn btn-primary">
            Add New Trending Game
          </Link>
        </div>
      </div>
    )}
  </div>
</div>


  <div className="section most-played">
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <div className="section-heading">
            <h6>TOP GAMES</h6>
            <h2>Most Played</h2>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="main-button">
            <Link href="/shop">View All</Link>
          </div>
        </div>
        <div className="col-lg-2 col-md-6 col-sm-6">
          <div className="item">
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/top-game-01.jpg" alt=""/></Link>
            </div>
            <div className="down-content">
                <span className="category">Adventure</span>
                <h4>Assasin Creed</h4>
                <Link href="/product-details">Explore</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-6 col-sm-6">
          <div className="item">
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/top-game-02.jpg" alt=""/></Link>
            </div>
            <div className="down-content">
                <span className="category">Adventure</span>
                <h4>Assasin Creed</h4>
                <Link href="/product-details">Explore</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-6 col-sm-6">
          <div className="item">
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/top-game-03.jpg" alt=""/></Link>
            </div>
            <div className="down-content">
                <span className="category">Adventure</span>
                <h4>Assasin Creed</h4>
                <Link href="/product-details">Explore</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-6 col-sm-6">
          <div className="item">
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/top-game-04.jpg" alt=""/></Link>
            </div>
            <div className="down-content">
                <span className="category">Adventure</span>
                <h4>Assasin Creed</h4>
                <Link href="/product-details">Explore</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-6 col-sm-6">
          <div className="item">
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/top-game-05.jpg" alt=""/></Link>
            </div>
            <div className="down-content">
                <span className="category">Adventure</span>
                <h4>Assasin Creed</h4>
                <Link href="/product-details">Explore</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-6 col-sm-6">
          <div className="item">
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/top-game-06.jpg" alt=""/></Link>
            </div>
            <div className="down-content">
                <span className="category">Adventure</span>
                <h4>Assasin Creed</h4>
                <Link href="/product-details">Explore</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="section categories">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 text-center">
          <div className="section-heading">
            <h6>Categories</h6>
            <h2>Top Categories</h2>
          </div>
        </div>
        <div className="col-lg col-sm-6 col-xs-12">
          <div className="item">
            <h4>Action</h4>
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/categories-01.jpg" alt=""/></Link>
            </div>
          </div>
        </div>
        <div className="col-lg col-sm-6 col-xs-12">
          <div className="item">
            <h4>Action</h4>
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/categories-05.jpg" alt=""/></Link>
            </div>
          </div>
        </div>
        <div className="col-lg col-sm-6 col-xs-12">
          <div className="item">
            <h4>Action</h4>
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/categories-03.jpg" alt=""/></Link>
            </div>
          </div>
        </div>
        <div className="col-lg col-sm-6 col-xs-12">
          <div className="item">
            <h4>Action</h4>
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/categories-04.jpg" alt=""/></Link>
            </div>
          </div>
        </div>
        <div className="col-lg col-sm-6 col-xs-12">
          <div className="item">
            <h4>Action</h4>
            <div className="thumb">
              <Link href="/product-details"><img src="/assets/images/categories-05.jpg" alt=""/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div className="section cta">
    <div className="container">
      <div className="row">
        <div className="col-lg-5">
          <div className="shop">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-heading">
                  <h6>Our Shop</h6>
                  <h2>Go Pre-Order Buy & Get Best <em>Prices</em> For You!</h2>
                </div>
                <p>Lorem ipsum dolor consectetur adipiscing, sed do eiusmod tempor incididunt.</p>
                <div className="main-button">
                  <Link href="/shop">Shop Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 offset-lg-2 align-self-end">
          <div className="subscribe">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-heading">
                  <h6>NEWSLETTER</h6>
                  <h2>Get Up To $100 Off Just Buy <em>Subscribe</em> Newsletter!</h2>
                </div>
                <div className="search-input">
                  <form id="subscribe" action="#">
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Your email..."/>
                    <button type="submit">Subscribe Now</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}
