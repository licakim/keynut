'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function MobileImageSlider({ images, state, initPhotoSwipe }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clientWidth, setClientWidth] = useState(0);
  const imageShowRef = useRef(null);
  const travelRatio = useRef(0);
  const initDragPos = useRef({ x: 0, y: 0 });
  const originOffset = useRef(0);
  const isScrolling = useRef(undefined);
  const pathname = usePathname();
  const totalChildren = images.length;

  useEffect(() => {
    if (imageShowRef.current) {
      setClientWidth(imageShowRef.current.clientWidth / totalChildren);
    }
  }, [totalChildren]);

  const end = useCallback(() => {
    setIsTransitioning(false);
    isScrolling.current = undefined;
    if (Math.abs(travelRatio.current) >= 0.2) {
      const newIdx =
        travelRatio.current > 0
          ? Math.max(currentImageIndex - 1, 0)
          : Math.min(currentImageIndex + 1, totalChildren - 1);
      setCurrentImageIndex(newIdx);
      if (imageShowRef.current)
        requestAnimationFrame(() => {
          imageShowRef.current.style.transform = `translateX(${newIdx * -clientWidth}px)`;
        });
      setOffset(newIdx * -clientWidth);
    } else {
      if (imageShowRef.current)
        requestAnimationFrame(() => {
          imageShowRef.current.style.transform = `translateX(${currentImageIndex * -clientWidth}px)`;
        });
    }
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', end);
  }, [clientWidth, totalChildren, offset]);

  const move = useCallback(
    e => {
      const travelX = e.touches[0].clientX - initDragPos.current.x;
      const travelY = e.touches[0].clientY - initDragPos.current.y;
      if (isScrolling.current === undefined) isScrolling.current = Math.abs(travelY) > Math.abs(travelX);

      if (isScrolling.current === false) {
        if ((travelX > 0 && currentImageIndex === 0) || (travelX < 0 && currentImageIndex === images.length - 1))
          return;
        e.preventDefault();
        if (Math.abs(travelRatio.current) < 0.8) {
          travelRatio.current = travelX / clientWidth;
          if (imageShowRef.current)
            requestAnimationFrame(() => {
              imageShowRef.current.style.transform = `translateX(${originOffset.current + travelX}px)`;
            });
        }
      }
    },
    [clientWidth, totalChildren, offset],
  );

  const startTouch = useCallback(
    e => {
      isScrolling.current = undefined;
      setIsTransitioning(true);
      travelRatio.current = 0;
      initDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      originOffset.current = offset;
      document.addEventListener('touchmove', move, { passive: false }); // passive: false 설정
      document.addEventListener('touchend', end);
    },
    [clientWidth, totalChildren, offset],
  );

  useEffect(() => {
    imageShowRef.current?.addEventListener('touchstart', startTouch, { passive: false });

    return () => {
      imageShowRef.current?.removeEventListener('touchstart', startTouch);
    };
  }, [clientWidth, totalChildren, offset]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full">
        <button className="flex relative overflow-hidden max-w-lg w-full">
          {state === 0 && (
            <div className="absolute flex items-center justify-center z-40 top-0 left-0 w-full h-full bg-black opacity-70">
              <p className="text-white font-semibold text-3xl">판매완료</p>
            </div>
          )}
          {state === 2 && (
            <div className="absolute left-1 top-1 z-10 rounded px-3 py-1  bg-gray-500 bg-opacity-55 flex items-center justify-center text-center">
              <p className="font-semibold text-white max-md:text-sm">예약중</p>
            </div>
          )}
          <div
            id="imageShow"
            className="flex bg-gray-50"
            onClick={() => initPhotoSwipe(currentImageIndex, imageShowRef.current, startTouch)}
            ref={imageShowRef}
            style={{
              transition: isTransitioning ? 'none' : 'transform 0.3s ',
            }}
          >
            {images.map((img, idx) => (
              <div key={idx} className="flex relative max-w-lg w-screen aspect-square">
                <Image
                  src={img}
                  alt="product-img"
                  fill
                  style={pathname.startsWith('/shop/product') ? { objectFit: 'cover' } : { objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </button>
      </div>
      {images.length > 1 && (
        <div className="flex space-x-3 mt-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border ${currentImageIndex === idx ? 'bg-gray-400' : 'bg-white'}`}
              onClick={() => {
                setOffset(idx * -clientWidth);
                setCurrentImageIndex(idx);
              }}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
