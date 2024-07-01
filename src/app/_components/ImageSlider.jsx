'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { isMobile } from '@/lib/isMobile';
import DesktopImageSlider from '../shop/product/[id]/_components/DesktopImageSlider';
import MobileImageSlider from '../shop/product/[id]/_components/MobileImageSlider';

export default function ImageSlider({ images, state }) {
  const [isM, setIsMobile] = useState(null);

  useEffect(() => {
    setIsMobile(isMobile());
  }, []);

  if (isM === true) return <MobileImageSlider images={images} state={state} />;
  if (isM === false) return <DesktopImageSlider images={images} state={state} />;
}
