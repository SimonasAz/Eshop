'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteListener() {
  const pathname = usePathname();

  useEffect(() => {
    // hide the preloader on each navigation
    document.getElementById('js-preloader')?.classList.add('loaded');
    // re‑layout isotope if you’re storing it globally
    if (window.isotopeInstance) window.isotopeInstance.layout();
  }, [pathname]);

  return null;
}