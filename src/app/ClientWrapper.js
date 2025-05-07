'use client';

import Preloader from '../components/Preloader';
import RouteListener from './RouteListener';

export default function ClientWrapper({ children }) {
  return (
    <>
      <Preloader />     {/* only on client */}
      {children}        {/* your page content */}
      <RouteListener /> {/* hides preloader & re‑layouts Isotope */}
    </>
  );
}