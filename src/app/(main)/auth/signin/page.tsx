'use client';
import { Suspense, useEffect, useState } from 'react';
import { getProviders, signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Nothing_You_Could_Do } from 'next/font/google';
import Link from 'next/link';

const title = Nothing_You_Could_Do({ subsets: ['latin'], weight: ['400'] });

interface Providers {
  kakao: {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  };
  naver: {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  };
}

function RenderSignIn() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Providers | {}>({});
  const [callbackUrl, setCallbackUrl] = useState('/');
  const params = useSearchParams();
  const router = useRouter();
  const error = params.get('error');

  useEffect(() => {
    if (error === 'OAuthAccountNotLinked') alert('이미 가입된 계정이 있습니다. 다른 플랫폼으로 로그인해 주세요.');
  }, []);

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
      router.push(callbackUrl);
    }
  }, [session]);

  const isProvidersLoaded = Object.keys(providers).length > 0;

  return (
    <div className=" bg-white flex flex-co min-h-70vh items-center justify-center max-[960px]:fixed max-[960px]:w-screen max-[960px]:top-0 max-[960px]:left-0 max-[960px]:z-50 ">
      <button className="fixed top-4 left-4 tb:hidden" onClick={() => router.back()}>
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
      <div className=" max-[960px]:flex max-[960px]:items-center max-[960px]:fixed max-[960px]:top-1/2 max-[960px]:left-1/2 max-[960px]:-translate-x-1/2 max-[960px]:-translate-y-1/2 flex flex-col gap-y-3 p-2">
        <Link
          href={'/'}
          onClick={e => {}}
          className={`${title.className} absolute -top-14 flex text-3xl justify-center cursor-pointer mb-4 tb:hidden`}
        >
          KEYNUT
        </Link>
        {['kakao', 'naver'].map(providerId => (
          <button
            key={providerId}
            onClick={isProvidersLoaded ? () => signIn(providerId, { callbackUrl }) : null}
            disabled={!isProvidersLoaded}
            className="disabled:cursor-wait disabled:opacity-50"
          >
            <Image
              className="min-w-80 "
              src={`/${providerId}Login.svg`}
              width={300}
              height={0}
              alt={`${providerId}Login`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense>
      <RenderSignIn />
    </Suspense>
  );
}
