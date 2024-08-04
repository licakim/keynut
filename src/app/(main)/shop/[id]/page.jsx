import RenderProfile from './RenderProfile';
import getUserProfile from '@/lib/getUserProfile';

export async function generateMetadata({ params }) {
  const { id } = params;
  const data = await getUserProfile(id);

  return {
    title: data ? `${data.nickname}ㅣKEYNUT` : 'KEYNUT',
    openGraph: {
      title: data ? `${data.nickname}ㅣKEYNUT` : 'KEYNUT',
      description: data ? `${data.nickname}님의 상점` : '상점을 찾을 수 없습니다.',
      images: [
        {
          url: data ? data.image : `${process.env.NEXT_PUBLIC_BASE_URL}/keynut.png`,
          width: 100,
          height: 100,
          alt: 'KEYNUT Logo',
        },
      ],
    },
  };
}

export default function Profile() {
  return <RenderProfile />;
}
