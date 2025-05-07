'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteListener() {
  const pathname = usePathname();

  useEffect(() => {
 
    document.getElementById('js-preloader')?.classList.add('loaded');
    
    if (window.isotopeInstance) window.isotopeInstance.layout();
  }, [pathname]);

  return null;
}