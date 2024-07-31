'use client';
import { useEffect, useState } from 'react';
import { getProviders, signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Nothing_You_Could_Do } from 'next/font/google';
import Link from 'next/link';

const title = Nothing_You_Could_Do({ subsets: ['latin'], weight: ['400'] });

export default function SignIn() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState({});
  const [callbackUrl, setCallbackUrl] = useState('/');
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const url = searchParams.get('callbackUrl') || '/';
      setCallbackUrl(url);
    }
  }, []);

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  useEffect(() => {
    if (session) {
      signOut();
    }
  }, [session]);

  const isProvidersLoaded = Object.keys(providers).length > 0;

  return (
    <div className=" bg-white flex flex-col items-center justify-center h-70vh max-md:fixed max-md:top-0 max-md:left-0 max-md:z-50 max-md:w-100vw max-md:h-100vh ">
      <button className="fixed top-4 left-4 md:hidden" onClick={() => router.back()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M20 12H4m0 0l6-6m-6 6l6 6"
          />
        </svg>
      </button>
      <div className="max-md:fixed max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 flex flex-col gap-y-3 p-2">
        <Link
          href={'/'}
          onClick={e => {}}
          className={`${title.className} flex text-3xl justify-center cursor-pointer mb-4 md:hidden`}
        >
          KEYNUT
        </Link>
        {['kakao', 'google'].map(providerId => (
          <button
            key={providerId}
            onClick={isProvidersLoaded ? () => signIn(providerId, { callbackUrl }) : null}
            disabled={!isProvidersLoaded}
            className="disabled:cursor-wait disabled:opacity-50"
          >
            <Image
              className="min-w-80 "
              src={`/${providerId}Login.svg`}
              width={350}
              height={0}
              alt={`${providerId}Login`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}