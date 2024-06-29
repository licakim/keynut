'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getRecentProducts from '../_lib/getRecentProducts';

import { Do_Hyeon, Stylish, Gowun_Dodum } from 'next/font/google';

const title = Gowun_Dodum({ subsets: ['latin'], weight: ['400'] });

const images = [
  {
    path: '/키보드1.webp',
    name: 'pdpdpdpdpdpdppdpdpdpdpdpdpdpdpdpdpdpdpdpdpdpdpd',
    price: '12,5000',
    bookMarked: false,
  },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000', bookMarked: false },
];
const picks = [
  { profile: '/키보드1.webp', path: '/키보드1.webp', name: 'orange keyboard', heart: 5, comment: 10, title: 'haha' },
  { profile: '/키보드3.jpeg', path: '/키보드4.png', name: 'yellow keyboard', heart: 5, comment: 10, title: 'hehe' },
  {
    profile: '/유리.webp',
    path: '/키보드3.jpeg',
    name: 'purple keyboard',
    heart: 5,
    comment: 10,
    title: '내 키보드 헤헤헤헤 이뿌지?',
  },
  { profile: '/철수.webp', path: '/키보드3.jpeg', name: 'purple keyboard', heart: 5, comment: 10, title: '내 키보두' },
  { profile: '/맹구.webp', path: '/키보드1.webp', name: 'orange keyboard', heart: 5, comment: 10, title: '내 키보두' },
];
export default function RenderHome() {
  const router = useRouter();
  const { data, error, isLoading } = useQuery({
    queryKey: ['recentProducts'],
    queryFn: getRecentProducts,
    // staleTime: 60 * 60 * 1000,
  });
  const TopPicks = ({ picks }) => {
    return (
      <div className="grid grid-cols-5 gap-2 max-md:flex overflow-auto scrollbar-hide">
        {picks.map((pick, idx) => (
          <div className="flex flex-col w-full" key={idx}>
            <div className="w-full aspect-4/5 relative min-h-32 min-w-32">
              <div className="absolute rounded-full z-10 bg-white w-12 h-12 top-1 left-1 flex items-start justify-center border border-solid max-md:w-10 max-md:h-10">
                <Image
                  className="rounded-full object-cover"
                  src={pick.profile}
                  alt={pick.name}
                  fill
                  sizes="(max-width:768px) 40px, 48px"
                />
              </div>
              <Image
                className="rounded object-cover"
                src={pick.path}
                alt={pick.name}
                fill
                sizes="(max-width:690px) 128px,(max-width:1280px) 20vw, 234px"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-md:main-768 -translate-y-6">
      <div
        className={`${title.className} flex flex-col text-center bg-gray-100 h-48 text-2xl items-center justify-center text-gray-500 max-md:text-lg max-md:px-4  max-md:translate-y-0`}
      >
        <div className="flex space-x-1">
          {/* <Image className="md:hidden" src="/keyboard.svg" width={60} height={60} /> */}
          {/* <Image className="md:hidden" src="/mouse.svg" width={30} height={30} /> */}
        </div>
        <div className="">키넛에서 다양한 전자제품을 쉽고 빠르게 거래해보세요!</div>
      </div>
      <div className="w-full max-w-screen-xl mx-auto px-10  space-y-12 my-10 max-md:px-2 ">
        <section className="flex flex-col space-y-5">
          <div className="flex flex-col">
            <div className="font-medium text-xl">cateory</div>
            <div className="text-gray-600 font-medium">카테고리</div>
          </div>
          <ul className="flex space-x-3 overflow-auto scrollbar-hide">
            <Link href={'/shop?categories=1'}>
              <li className="flex w-28 aspect-square min-h-16 min-w-16 bg-white  border rounded">키보드</li>
            </Link>
            <Link href={'/shop?categories=2'}>
              <li className="flex w-28 aspect-square min-h-16 min-w-16 bg-white border rounded">마우스</li>
            </Link>
            <Link href={'/shop?categories=3'}>
              <li className="flex w-28 aspect-square min-h-16 min-w-16 bg-white border rounded">기타</li>
            </Link>
            {/* <li className="flex w-28 aspect-square min-h-16 min-w-16 bg-white  border rounded">갤러리</li> */}
          </ul>
        </section>
        <section className="flex flex-col space-y-5">
          <div className="flex items-end">
            <div className="flex flex-1 flex-col bg-re">
              <div className="font-medium text-xl">just in</div>
              <div className="text-gray-600 font-medium">신규 등록 상품</div>
            </div>
            <Link href={'/shop'}>
              <div className="flex items-center font-medium text-sm">
                더보기
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v14m-7-7h14"
                  />
                </svg>
              </div>
            </Link>
          </div>
          <div className={`grid grid-cols-5 gap-2 overflow-auto scrollbar-hide max-md:flex`}>
            {data?.map((product, idx) => (
              <div
                className="flex flex-col cursor-pointer max-md:max-w-40 max-md:w-40 "
                key={idx}
                onClick={() => {
                  router.push(`/shop/product/${product._id}`);
                }}
              >
                <div className="w-full aspect-square relative min-h-32 min-w-32">
                  <Image
                    src={product.images[0]}
                    alt={product._id}
                    sizes="(max-width: 690px) 250px, (max-width: 1280px) 40vw, 500px"
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <div className="mt-2 w-full">
                  <div className="text-lg break-all line-clamp-1">{product.title}</div>
                  <div className="space-x-1 font-semibold break-before-all line-clamp-1">
                    <span>{product.price}</span>
                    <span className="text-sm">원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
