'use client';

import Preloader from '../components/Preloader';
import RouteListener from './RouteListener';

export default function ClientWrapper({ children }) {
  return (
    <>    
      {children}       
    </>
  );
}