'use client';

import { useEffect } from 'react';

export interface MobileStickyControllerProps { targetId: string }

export function MobileStickyController({ targetId }: MobileStickyControllerProps) {
  useEffect(() => {
    const headerEl = document.getElementById(targetId);

    if (!headerEl) {
      return;
    }

    let lastY = window.scrollY;
    let ticking = false;

    const isMobile = () => window.matchMedia('(max-width: 759px)').matches;

    const onScroll = () => {
      if (!isMobile()) {
        return;
      }
      if (ticking) {
        return;
      }
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;

        // Show when scrolling up slightly, hide when scrolling down
        if (delta > 2) {
          headerEl.setAttribute('data-hidden', 'true');
        } else if (delta < -2) {
          headerEl.setAttribute('data-hidden', 'false');
        }

        lastY = currentY;
        ticking = false;
      });
      ticking = true;
    };

    const onResize = () => {
      // Ensure header is visible when leaving mobile breakpoint
      if (!isMobile()) {
        headerEl.removeAttribute('data-hidden');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [targetId]);

  return null;
}
