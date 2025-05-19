import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { cookies } from 'next/headers'

export default async function Home() {
  const trendingGames = await prisma.trendingGame.findMany({
  include: { game: true },
  orderBy: { createdAt: 'desc' },
  take: 4
})
  const mostPlayedGames = await prisma.game.findMany({ 
    orderBy: { createdAt: 'desc' }, 
    take: 6
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
            <p>LUGX Gaming is a gaming website. You can find many of your games on this site</p>
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
                <img src="/assets/images/featured-01.png" alt="" style={{ maxWidth: '60px', margin: ' 14px auto 0', display: 'block' }}/>
              </div>
              <h4>Free Storage</h4>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-md-6">
          <Link href="#">
            <div className="item">
              <div className="image">
                <img src="/assets/images/featured-02.png" alt="" style={{ maxWidth: '60px', margin: ' 14px auto 0', display: 'block'}}/>
              </div>
              <h4>User More</h4>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-md-6">
          <Link href="#">
            <div className="item">
              <div className="image">
                <img src="/assets/images/featured-03.png" alt="" style={{ maxWidth: '60px', margin: ' 14px auto 0', display: 'block'}}/>
              </div>
              <h4>Reply Ready</h4>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-md-6">
          <Link href="#">
            <div className="item">
              <div className="image">
                <img src="/assets/images/featured-04.png" alt="" style={{ maxWidth: '60px', margin: ' 14px auto 0', display: 'block' }}/>
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
               {trendingGames.map(tr => (
              <div key={tr.id} className="col-lg-3 col-md-6">
                <div className="item">
                  <div className="thumb" style={{ position: 'relative' }}>
                    {isAdmin && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          right: '10px',
                          display: 'flex',
                          gap: '8px',
                          zIndex: 2
                        }}
                      >
                        <Link href={`/admin/trending/edit/${tr.id}`} className="btn btn-sm btn-light border">
                          <i className="fa fa-pencil"></i>
                        </Link>
                        <Link href={`/admin/trending/delete/${tr.id}`} className="btn btn-sm btn-danger">
                          <i className="fa fa-trash"></i>
                        </Link>
                      </div>
                    )}
                    <Link href={`/product-details/${tr.id}`}>
                      <img
                        src={tr.imageUrl || '/assets/images/placeholder.png'}
                        alt={tr.title}
                      />
                    </Link>
                    <span className="price">
                      {tr.discount ? (
                        <>
                          <em>${tr.price.toFixed(2)}</em> ${ (tr.price * (1 - tr.discount)).toFixed(2) }
                        </>
                      ) : (
                        `$${tr.price.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="down-content">
                    <span className="category">{tr.category}</span>
                    <h4>{tr.title}</h4>
                    <Link href={`/product-details/${tr.id}`}>
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
    </div>

    <div className="row">
      {mostPlayedGames.map(game => (
        <div key={game.id} className="col-lg-3 col-md-6">
          <div className="item">
            <div className="thumb" style={{ position: 'relative' }}>
              {/* Admin controls */}
              {isAdmin && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 2
                  }}
                >
                  <Link href={`/admin/games/edit/${game.id}`} className="btn btn-sm btn-light border">
                    <i className="fa fa-pencil"></i>
                  </Link>
                  <Link href={`/admin/games/delete/${game.id}`} className="btn btn-sm btn-danger">
                    <i className="fa fa-trash"></i>
                  </Link>
                </div>
              )}

              {/* Game image */}
              <Link href={`/product-details/${game.id}`}>
                <img
                      src={game.imageUrl || '/assets/images/placeholder.png'}
                      alt={game.title}
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover'                
                      }}
                    />
              </Link>

              {/* Price badge */}
              <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#0099ff',
                  color: 'white',
                  padding: '10px 10px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  minWidth: '80px'
                }}>
                  {game.discount ? (
                    <>
                      <div style={{ textDecoration: 'line-through', fontSize: '12px', opacity: 0.85 }}>
                        ${game.price.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '15px' }}>
                        ${(game.price * (1 - game.discount)).toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <div>${game.price.toFixed(2)}</div>
                  )}
                </span>
            </div>

            {/* Category, title, cart icon */}
            <div  
                className="down-content"  
                style={{  
                  position: 'relative',  
                  padding: '15px 20px 30px',  
                  textAlign: 'left'  
                }}  
              >  
                <span className="category">{game.category}</span>  
                <h4 style={{ margin: '8px 0', fontSize: '16px' }}>{game.title}</h4>
                  <Link
                  href={`/product-details/${game.id}`}
                  style={{
                    position: 'absolute',
                    bottom: '25px',        
                    left: '290px',         
                    backgroundColor: '#ff556e',
                    width: '44px',         
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'                    
                  }}
                >
                  <i
                    className="fa fa-shopping-bag"
                    style={{ color: 'white', fontSize: '18px' }}
                  ></i>
                </Link>
              </div>
          </div>
        </div>
      ))}
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
