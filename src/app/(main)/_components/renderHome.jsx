'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getRecentProducts from '../_lib/getRecentProducts';

import { Gowun_Dodum } from 'next/font/google';
import onClickProduct from '@/utils/onClickProduct';
import { isMobile } from '@/lib/isMobile';

const title = Gowun_Dodum({ subsets: ['latin'], weight: ['400'] });

const JustIn = ({ mobile }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['recentProducts'],
    queryFn: getRecentProducts,
    staleTime: Infinity,
  });
  return (
    <div className={`grid grid-cols-5 gap-2 overflow-auto scrollbar-hide max-md:flex`}>
      {data?.map((product, idx) => (
        <div className="flex flex-col cursor-pointer relative max-md:max-w-40 max-md:w-40 max-md:text-sm" key={idx}>
          <div className="w-full aspect-square relative min-h-32 min-w-32 bg-gray-100">
            <Image
              src={product.images[0]}
              alt={product._id}
              sizes="(max-width: 690px) 250px, (max-width: 1280px) 40vw, 500px"
              fill
              className="rounded object-cover"
            />
          </div>
          <div className="mt-2 w-full">
            <div className="break-all line-clamp-1">{product.title}</div>
            <div className="space-x-1 font-semibold break-before-all line-clamp-1">
              <span>{product.price.toLocaleString()}</span>
              <span className="text-sm">원</span>
            </div>
          </div>
          <Link
            href={`/shop/product/${product._id}`}
            className="absolute top-0 left-0 w-full h-full rounded"
            onClick={e => mobile && onClickProduct(e)}
          ></Link>
        </div>
      ))}
      <div className="flex justify-center md:hidden">
        <div className="flex flex-col w-20 justify-center items-center relative space-y-1 h-32">
          <div className="relative">
            <svg className="" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16">
              <g fill="gray">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </g>
            </svg>
          </div>
          <p className="text-xs absolute bottom-6 text-gray-600">더보기</p>
          <Link
            href={'/shop'}
            className="absolute top-0 left-0 w-full h-full"
            onClick={e => mobile && onClickProduct(e)}
          ></Link>
        </div>
      </div>
    </div>
  );
};

export default function RenderHome() {
  const mobile = isMobile();
  return (
    <div className="flex flex-col w-full max-md:main-768 -translate-y-6">
      <div
        className={`${title.className} flex flex-col text-center bg-black overflow-hidden h-48 text-2xl items-center relative justify-center max-md:h-36 text-gray-500 max-md:text-lg max-md:px-4  max-md:translate-y-0`}
      >
        {/* <Image className="absolute top-5 left-10 -rotate-12 " src="/keyboard.svg" width={100} height={100} /> */}
        {/* <Image className="absolute bottom-0 left-1/3 rotate-12 " src="/keyboard.svg" width={70} height={70} /> */}
        {/* <Image className="absolute left-72 bottom-7" src="/headphone.svg" width={50} height={50} /> */}
        {/* <Image className="absolute left-1/2 rotate-12" src="/headphone.svg" width={60} height={60} /> */}

        <div className="flex items-center justify-center font-semibold text-gray-100 z-20">
          키넛에서 다양한 전자제품을 쉽고 빠르게 거래해보세요!
        </div>
      </div>
      <div className="w-full max-w-screen-xl mx-auto px-10  space-y-12 my-10 max-md:px-2 ">
        <section className="flex flex-col space-y-5">
          <div className="flex flex-col">
            <div className="font-medium text-xl">cateory</div>
            <div className="text-gray-500 font-medium">카테고리</div>
          </div>
          <ul className="flex space-x-3 overflow-auto scrollbar-hide">
            <li className="flex flex-col items-center space-y-1">
              <div className="relative">
                <div className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-gray-100 justify-center items-center max-md:w-24">
                  <Image className="max-md:w-16" src="/keyboard.svg" width={80} height={80} alt="keyboard" />
                </div>
                <Link
                  href={'/shop?categories=1'}
                  className="absolute top-0 left-0 w-full h-full"
                  onClick={e => mobile && onClickProduct(e)}
                ></Link>
              </div>
              <p className="text-gray-600">키보드</p>
            </li>
            <li className="flex flex-col items-center space-y-1">
              <div className="relative">
                <div className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-slate-100 justify-center items-center max-md:w-24">
                  <Image className="max-md:w-9" src="/mouse.svg" width={45} height={45} alt="mouse" />
                </div>
                <Link
                  href={'/shop?categories=2'}
                  className="absolute top-0 left-0 w-full h-full"
                  onClick={e => mobile && onClickProduct(e)}
                ></Link>
              </div>
              <p className="text-gray-600">마우스</p>
            </li>
            <li className="flex flex-col items-center space-y-1">
              <div className="relative">
                <div className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-black bg-opacity-10 justify-center items-center max-md:w-24">
                  <svg
                    className="max-md:w-10"
                    xmlns="http://www.w3.org/2000/svg"
                    width="45px"
                    height="45px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      d="M7.673 21.02L11.712 14L4 13.096L15.25 2.981h1.116l-4.135 7.038l7.769.885L8.75 21.019z"
                    />
                  </svg>
                </div>
                <Link
                  href={'/shop?categories=9'}
                  className="absolute top-0 left-0 w-full h-full"
                  onClick={e => mobile && onClickProduct(e)}
                ></Link>
              </div>
              <p className="text-gray-600">기타</p>
            </li>
            {/* <li className="flex w-28 aspect-square min-h-16 min-w-16 bg-white  border rounded">갤러리</li> */}
          </ul>
        </section>
        <section className="flex flex-col space-y-5">
          <div className="flex items-end">
            <div className="flex flex-1 flex-col bg-re">
              <div className="font-medium text-xl">just in</div>
              <div className="text-gray-500 font-medium">신규 등록 상품</div>
            </div>
            <Link href={'/shop'} className="rounded" onClick={e => mobile && onClickProduct(e)}>
              <div className="flex items-center font-medium text-sm text-gray-500 px-0.5">더보기</div>
            </Link>
          </div>
          <JustIn mobile={mobile} />
        </section>
      </div>
      {/* <section className="flex flex-col space-y-5">
        <div className="flex items-end">
        <div className="flex flex-1 flex-col">
        <div className="font-medium text-xl">top picks</div>
        <div className="text-gray-600 font-medium">인기 사진</div>
        </div>
        <Link href={'/gallery'}>
            <div className="font-medium text-sm">더보기 +</div>
          </Link>
        </div>
        <TopPicks picks={picks} />
      </section> */}
    </div>
  );
}
