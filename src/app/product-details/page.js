'use client';
import Link from 'next/link';
export default function ProductDetails() {
  return  (
      <>
  {/* ***** Header Area Start ***** */}
  <header className="header-area header-sticky">
    <div className="container">
        <div className="row">
            <div className="col-12">
                <nav className="main-nav">
                    {/* ***** Logo Start ***** */}
                    <Link href="/" className="logo">
                        <img src="/assets/images/logo.png" alt="" style={{ width: '158px' }}/>
                    </Link>
                    {/* ***** Logo End ***** */}
                    {/* ***** Menu Start ***** */}
                    <ul className="nav">
                      <li><Link href="/">Home</Link></li>
                      <li><Link href="/shop">Our Shop</Link></li>
                      <li><Link href="/product-details" className="active">Product Details</Link></li>
                      <li><Link href="/contact">Contact Us</Link></li>
                      <li><a href="/login">Sign In</a></li>
                  </ul>   
                  <a href="#" className="menu-trigger">
                    <span>Menu</span>
                  </a>
                    {/* ***** Menu End ***** */}
                </nav>
            </div>
        </div>
    </div>
  </header>
  {/* ***** Header Area End ***** */}

  <div className="page-heading header-text">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <h3>Modern Warfare® II</h3>
          <span className="breadcrumb">
            <a href="/">Home</a> &gt; <Link href="/shop">Shop</Link> &gt; Assassin Creed
          </span>
        </div>
      </div>
    </div>
  </div>

  <div className="single-product section">
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <div className="left-image">
            <img src="/assets/images/single-game.jpg" alt=""/>
          </div>
        </div>
        <div className="col-lg-6 align-self-center">
          <h4>Call of Duty®: Modern Warfare® II</h4>
          <span className="price"><em>$28</em> $22</span>
          <p>LUGX Gaming Template is based on the latest Bootstrap 5 CSS framework. This template is provided by TemplateMo and it is suitable for your gaming shop ecommerce websites. Feel free to use this for any purpose. Thank you.</p>
          <form id="number" action="#">
            <input type="number" className="form-control" id="1" aria-describedby="quantity" placeholder="1" defaultValue={1} />
            <button type="submit"><i className="fa fa-shopping-bag"></i> ADD TO CART</button>
          </form>
          <ul>
            <li><span>Game ID:</span> COD MMII</li>
            <li><span>Genre:</span><a href="#">Action</a>, <a href="#">Team</a>, <a href="#">Single</a></li>
            <li><span>Multi-tags:</span> <Link href="#">War</Link>, <Link href="#">Battle</Link>, <Link href="#">Royal</Link></li>
          </ul>
        </div>
        <div className="col-lg-12">
          <div className="sep"></div>
        </div>
      </div>
    </div>
  </div>

  <div className="more-info">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="tabs-content">
            <div className="row">
              <div className="nav-wrapper ">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="true">Description</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-controls="reviews" aria-selected="false">Reviews (3)</button>
                  </li>
                </ul>
              </div>              
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                  <p>You can search for more templates on Google Search using keywords such as "templatemo digital marketing", "templatemo one-page", "templatemo gallery", etc. Please tell your friends about our website. If you need a variety of HTML templates, you may visit Tooplate and Too CSS websites.</p>
                  <br />
                  <p>Coloring book air plant shabby chic, crucifix normcore raclette cred swag artisan activated charcoal. PBR&B fanny pack pok pok gentrify truffaut kitsch helvetica jean shorts edison bulb poutine next level humblebrag la croix adaptogen. Hashtag poke literally locavore, beard marfa kogi bruh artisan succulents seitan tonx waistcoat chambray taxidermy. Same cred meggings 3 wolf moon lomo irony cray hell of bitters asymmetrical gluten-free art party raw denim chillwave tousled try-hard succulents street art.</p>
                </div>
                <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                  <p>Coloring book air plant shabby chic, crucifix normcore raclette cred swag artisan activated charcoal. PBR&B fanny pack pok pok gentrify truffaut kitsch helvetica jean shorts edison bulb poutine next level humblebrag la croix adaptogen. <br /><br />Hashtag poke literally locavore, beard marfa kogi bruh artisan succulents seitan tonx waistcoat chambray taxidermy. Same cred meggings 3 wolf moon lomo irony cray hell of bitters asymmetrical gluten-free art party raw denim chillwave tousled try-hard succulents street art.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="section categories related-games">
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <div className="section-heading">
            <h6>Action</h6>
            <h2>Related Games</h2>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="main-button">
            <Link href="/shop">View All</Link>
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

  <footer>
    <div className="container">
      <div className="col-lg-12">
        <p>Copyright © 2048 LUGX Gaming Company. All rights reserved. &nbsp;&nbsp; <Link rel="nofollow" href="https://templatemo.com" target="_blank">Design: TemplateMo</Link></p>
      </div>
    </div>
  </footer>
    </>
  );
}