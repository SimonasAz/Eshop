import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'Lugx Gaming',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="/vendor/bootstrap/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="/assets/css/fontawesome.css"
        />
        <link
          rel="stylesheet"
          href="/assets/css/templatemo-lugx-gaming.css"
        />
        <link rel="stylesheet" href="/assets/css/owl.css" />
        <link
          rel="stylesheet"
          href="/assets/css/animate.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/swiper@7/swiper-bundle.min.css"
        />
      </head>
      <body>
        {children}
      
        <Script
          src="/vendor/jquery/jquery.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/vendor/bootstrap/js/bootstrap.min.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/owl-carousel.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/counter.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/custom.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}