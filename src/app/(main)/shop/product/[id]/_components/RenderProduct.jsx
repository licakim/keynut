'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import ImageSlider from '@/app/(main)/_components/ImageSlider';
import Image from 'next/image';
import timeAgo from '@/utils/timeAgo';
import OpenChatLink from './OpenChatLink';
import { useQuery } from '@tanstack/react-query';
import getProductWithUser from '../_lib/getProductWithUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn, useSession } from 'next-auth/react';
import Modal from '@/app/(main)/_components/Modal';
import { useRouter } from 'next/navigation';
import onClickProduct from '@/utils/onClickProduct';
import { isMobile } from '@/lib/isMobile';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';

const RenderCondition = ({ condition }) => {
  if (condition === 1) condition = '미사용';
  else if (condition === 2) condition = '사용감 없음';
  else if (condition === 3) condition = '사용감 적음';
  else if (condition === 4) condition = '사용감 많음';
  else if (condition === 5) condition = '고장 / 파손';

  return (
    <div className="flex space-x-2 justify-center items-center">
      <div className="flex  items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        <span>상품상태</span>
      </div>
      <span>{condition}</span>
    </div>
  );
};

const RenderCategory = ({ category }) => {
  const obj = {
    // 키보드
    10: '커스텀',
    11: '기성품',
    12: '스위치',
    13: '보강판',
    14: '아티산',
    15: '키캡',
    16: 'PCB',
    19: '기타',

    // 마우스
    20: '완제품',
    21: '마우스피트',
    22: '그립테이프',
    23: 'PCB',
    29: '기타',

    // 패드
    30: '마우스패드',
    31: '장패드',
    39: '기타',

    // 기타
    99: '기타',
  };
  let mainCategory = '';

  if (category >= 10 && category <= 19) mainCategory = '키보드';
  else if (category >= 20 && category <= 29) mainCategory = '마우스';
  else if (category >= 30 && category <= 39) mainCategory = '패드';
  else mainCategory = '기타';

  return (
    <div className="flex w-full px-10 max-md:px-4 max-md:pb-3 justify-between">
      <span className="flex items-center text-gray-400 text-sm">
        <Link href={`/shop?categories=${~~(category / 10) ? ~~(category / 10) : 9}`}>{mainCategory}</Link>
        {category !== 9 && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24">
              <g fill="none" fillRule="evenodd">
                <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path
                  fill="#ababab"
                  d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"
                />
              </g>
            </svg>
            <Link href={`/shop?categories=${category}`}>{obj[category]}</Link>
          </>
        )}
      </span>
      <img src="/product/more.svg" width={24} height={24} alt="MORE" className="hidden max-[480px]:block" />
    </div>
  );
};

const RenderTimeAgo = ({ date }) => {
  return <p>{timeAgo(date)}</p>;
};

const RenderBookMark = ({ bookmarked }) => {
  return (
    <div className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 32 32">
        <path fill="currentColor" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
      <p>{bookmarked.length}</p>
    </div>
  );
};

const RenderViews = ({ views }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.3rem" height="1.3rem" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
        />
      </svg>
      <p>{views}</p>
    </div>
  );
};

const RenderProfile = ({ user }) => {
  const mobile = isMobile();
  if (!user) return;

  return (
    <>
      <div className="flex max-w-md justify-between border rounded flex-wrap p-2">
        <div className="flex items-center space-x-2">
          <Link
            href={`/shop/${user._id}`}
            className="flex relative rounded-full  aspect-square justify-center items-center cursor-pointer"
          >
            {user.image ? (
              <div className="relative w-10 h-10">
                <Image className="rounded-full" src={user.image} sizes="80px" alt="profile" fill />
              </div>
            ) : (
              <div className="w-10 h-10 defualt-profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
                  <path
                    fill="rgb(229, 231, 235)"
                    d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
                  />
                </svg>
              </div>
            )}
          </Link>
          <Link href={`/shop/${user._id}`} className="text-lg max-md:text-base line-clamp-1">
            {user.nickname}
          </Link>
        </div>
        <Link
          className="flex items-center rounded"
          href={`/shop/${user._id}`}
          onClick={e => mobile && onClickProduct(e)}
        >
          {/* <p className=" text-base px-2 border border-gray-300 rounded max-md:text-sm line-clamp-1">상점 가기</p>
           */}
          <svg xmlns="http://www.w3.org/2000/svg" width="1.7rem" height="1.7rem" viewBox="0 0 24 24">
            <path
              fill="lightgray"
              d="M3.778 3.655c-.181.36-.27.806-.448 1.696l-.598 2.99a3.06 3.06 0 1 0 6.043.904l.07-.69a3.167 3.167 0 1 0 6.307-.038l.073.728a3.06 3.06 0 1 0 6.043-.904l-.598-2.99c-.178-.89-.267-1.335-.448-1.696a3 3 0 0 0-1.888-1.548C17.944 2 17.49 2 16.582 2H7.418c-.908 0-1.362 0-1.752.107a3 3 0 0 0-1.888 1.548M18.269 13.5a4.53 4.53 0 0 0 2.231-.581V14c0 3.771 0 5.657-1.172 6.828c-.943.944-2.348 1.127-4.828 1.163V18.5c0-.935 0-1.402-.201-1.75a1.5 1.5 0 0 0-.549-.549C13.402 16 12.935 16 12 16s-1.402 0-1.75.201a1.5 1.5 0 0 0-.549.549c-.201.348-.201.815-.201 1.75v3.491c-2.48-.036-3.885-.22-4.828-1.163C3.5 19.657 3.5 17.771 3.5 14v-1.081a4.53 4.53 0 0 0 2.232.581a4.549 4.549 0 0 0 3.112-1.228A4.643 4.643 0 0 0 12 13.5a4.644 4.644 0 0 0 3.156-1.228a4.549 4.549 0 0 0 3.112 1.228"
            />
          </svg>
        </Link>
      </div>
    </>
  );
};

const RenderBookmarkButton = ({ productId, bookmarked, session, queryClient }) => {
  const isBookmarked = session && bookmarked.includes(session.user.id);
  const color = isBookmarked ? 'black' : 'white';

  const mutation = useMutation({
    mutationFn: async ({ productId }) => {
      const res = await fetch(`/api/products/${productId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBookmarked }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      return data;
    },
    onMutate: async ({ productId, isBookmarked }) => {
      await queryClient.cancelQueries(['product', productId]);
      const previousProduct = queryClient.getQueryData(['product', productId]);
      queryClient.setQueryData(['product', productId], old => ({
        ...old,
        bookmarked: isBookmarked
          ? old.bookmarked.filter(id => id !== session.user.id)
          : [...old.bookmarked, session.user.id],
      }));
      return { previousProduct };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['product', variables.productId], context.previousProduct);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(['product', variables.productId]);
    },
  });

  const handleClick = () => {
    if (!session) return signIn();
    mutation.mutate({ productId, isBookmarked });
  };

  return (
    <button onClick={handleClick} className="flex justify-end items-center w-10 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 32 32">
        <path fill={color} stroke="black" strokeWidth={3} d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
    </button>
  );
};

const RenderHashTag = ({ product }) => {
  return (
    <div className="flex text-gray-500 flex-wrap">
      {product.tags.map((e, idx) => (
        <Link href={`/shop?keyword=${encodeURIComponent(e)}`} key={idx} className="flex items-center mr-3">
          <span>{e}</span>
        </Link>
      ))}
    </div>
  );
};

const RenderDescriptor = ({ product }) => {
  return (
    <div className="border px-2 py-1 rounded min-h-24">
      <p className="whitespace-pre-wrap">{product.description}</p>
    </div>
  );
};

const IsWriter = ({ id, state, session, setDeleteState, setUpModal, setRaiseCount, queryClient }) => {
  const [settingModal, setSettingModal] = useState(null);
  const invalidateFilters = useInvalidateFiltersQuery();

  const mutation = useMutation({
    mutationFn: async ({ productId }) => {
      const res = await fetch(`/api/products/${productId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Network response was not ok');
      return data;
    },
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries(['product', productId]);
      const previousProduct = queryClient.getQueryData(['product', productId]);
      queryClient.setQueryData(['product', productId], old => ({
        ...old,
        state: state === 1 ? 0 : 1,
      }));
      return previousProduct;
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['product', variables.productId], context.previousProduct);
    },
    onSettled: (data, error, variables) => {
      invalidateFilters();
      queryClient.invalidateQueries(['product', variables.productId]);
    },
  });

  const onClickSelling = () => {
    if (!session) return signIn();
    else if (state === 1) return;
    mutation.mutate({ productId: id });
  };

  const onClickSellCompleted = () => {
    if (!session) return signIn();
    else if (state === 0) return;
    mutation.mutate({ productId: id });
  };

  const openUpModal = async () => {
    if (!session) return signIn();
    try {
      const res = await fetch(`/api/user/${session.user.id}/profile`);
      const data = await res.json();
      if (!res.ok) {
      }
      setRaiseCount(data.raiseCount);
      setUpModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          className="align-text-top items-center p-2 rounded max-[480px]:hidden"
          onClick={e => {
            onClickProduct(e);
            setSettingModal(true);
          }}
        >
          <img src="/product/more.svg" width={24} height={24} alt="MORE" />
        </button>
        <div className="space-x-1 bg-slate-200 p-1 rounded-sm max-[480px]:text-sm">
          <button onClick={onClickSelling} className={`${state === 1 ? 'bg-white' : 'opacity-30'} p-1 rounded-s-sm`}>
            판매중
          </button>
          <button
            onClick={onClickSellCompleted}
            className={`${state === 0 ? 'bg-white' : 'opacity-30'} p-1 rounded-e-sm`}
          >
            판매완료
          </button>
        </div>
      </div>
      {settingModal && (
        <div
          className="fixed w-d-screen h-d-screen top-0 left-0 z-50 flex flex-col justify-center items-center"
          onClick={e => {
            if (e.currentTarget === e.target) setSettingModal(false);
          }}
        >
          <div className="flex flex-col justify-center items-center rounded-md border space-y-1 bg-white w-72">
            <Link
              className="flex items-center justify-center space-x-1 w-full py-4 text-center font-semibold border-b"
              href={`/shop/product/${id}/edit`}
            >
              <p>수정</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z"
                />
                <path
                  fill="currentColor"
                  d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"
                />
              </svg>
            </Link>
            <button
              className="flex items-center justify-center space-x-1 w-full py-4 font-semibold border-b"
              onClick={openUpModal}
            >
              <p>UP</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M11.223 8.372L5.129 15.14a.517.517 0 0 0 .383.859h12.976a.519.519 0 0 0 .383-.86l-6.094-6.81a1.036 1.036 0 0 0-1.554.042"
                />
              </svg>
            </button>
            <button
              className="flex items-center justify-center space-x-1 w-full py-4 font-semibold text-red-500"
              onClick={() => {
                setSettingModal(false);
                setDeleteState(true);
              }}
            >
              <p>삭제</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 12 12">
                <path
                  fill="currentColor"
                  d="M5 3h2a1 1 0 0 0-2 0M4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zM5 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M3.38 9.085a1 1 0 0 0 .997.915h3.246a1 1 0 0 0 .996-.915L9.055 4h-6.11z"
                />
              </svg>
            </button>
            {/* <button className={`${state === 1 ? 'bg-main' : ''} w-full py-4 font-semibold`} onClick={onClickSelling}>
              판매중
            </button>
            <button
              className={`${state === 0 ? 'bg-main' : ''} w-full py-4 font-semibold`}
              onClick={onClickSellCompleted}
            >
              판매완료
            </button> */}
          </div>
        </div>
      )}
    </>
  );
};

const incrementViewCount = async productId => {
  const res = await fetch(`/api/products/${productId}`, {
    method: 'PUT',
  });
  return res.json();
};

export default function RenderProduct({ id }) {
  const queryClient = useQueryClient();
  const [deleteState, setDeleteState] = useState(false);
  const [upModal, setUpModal] = useState(false);
  const [raiseCount, setRaiseCount] = useState(5);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data, error, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductWithUser(id),
    staleTime: Infinity,
  });
  const invalidateFilters = useInvalidateFiltersQuery();
  const { user = null, ...product } = data || {};

  useEffect(() => {
    const fetchUpdateViews = async () => {
      const data = await incrementViewCount(id);
      if (!data) {
        alert('삭제된 상품입니다.');
        invalidateFilters();
        return router.back();
      }
      queryClient.setQueryData(['product', id], oldData => ({
        ...oldData,
        views: data.views,
      }));
    };
    fetchUpdateViews();
  }, []);

  const writer = status !== 'loading' && session ? session.user.id === product.userId : false;

  const deleteProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        invalidateFilters();
        router.back();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!data && isLoading === false) return router.replace('/');
  if (error) return <div>Error loading product</div>;
  if (!data) return <div>데이터를 가져오고 있습니다...</div>;
  return (
    <div className="max-w-screen-xl mx-auto max-md:main-768">
      <RenderCategory category={Number(product.category)} />
      <ImageSlider images={product.images} state={product.state} />
      <div className="p-10 space-y-6 max-md:px-4">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">{product.title}</p>
          <div className="flex">
            {writer || session?.admin ? (
              <IsWriter
                id={id}
                state={product.state}
                session={session}
                setDeleteState={setDeleteState}
                setUpModal={setUpModal}
                setRaiseCount={setRaiseCount}
                queryClient={queryClient}
              />
            ) : (
              <>
                <OpenChatLink url={product.openChatUrl} />
                <RenderBookmarkButton
                  productId={id}
                  bookmarked={product.bookmarked}
                  session={session}
                  queryClient={queryClient}
                />
              </>
            )}
          </div>
        </div>
        <RenderHashTag product={product} />
        <p className="space-x-2">
          <span className="text-2xl font-bold">{Number(product.price).toLocaleString()}</span>
          <span className="text-xl">원</span>
        </p>
        <div className="flex w-full justify-between text-sm text-slate-500 font-semibold">
          <RenderCondition condition={Number(product.condition)} />
          <div className="flex space-x-2 font-normal text-gray-400">
            <RenderTimeAgo date={product.createdAt} />
            <RenderBookMark bookmarked={product.bookmarked} />
            <RenderViews views={product.views} />
          </div>
        </div>
        {!writer && <RenderProfile user={user} />}
        <RenderDescriptor product={product} />
      </div>
      {deleteState && <Modal message={'삭제하시겠습니까?'} yesCallback={deleteProduct} modalSet={setDeleteState} />}
      {upModal && <Modal message={'UP'} subMessage={`${raiseCount}개있고 사용할꺼야 말꺼야`} modalSet={setUpModal} />}
    </div>
  );
}
