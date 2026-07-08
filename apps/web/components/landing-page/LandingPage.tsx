import Link from 'next/link';
import * as styles from './LandingPage.css';

const features = [
  {
    title: '게시판',
    description: '무인매장 운영 이야기와 실무 팁을 나눠요.',
    href: '/posts',
  },
  {
    title: '소통',
    description: '댓글로 의견을 주고받으며 함께 고민해요.',
    href: '/',
  },
  {
    title: '상품',
    description: '무모 회원 전용 상품을 구매해요.',
    href: '/products',
  },
];

export default function LandingPage() {
  return (
    <main className={styles.page}>
      <span className={styles.badge}>커뮤니티</span>
      <h1 className={styles.title}>Moomo</h1>
      <p className={styles.description}>
        무인매장 운영자들의 모임, Moomo 입니다.
        <br />
        노하우를 나누고, 이야기를 이어가는 공간입니다.
      </p>

      <div className={styles.featureGrid}>
        {features.map((feature) => (
          <div key={feature.title} className={styles.featureCard}>
            <h2 className={styles.featureTitle}>{feature.title}</h2>
            <Link href={feature.href} className={styles.featureDescription}>
              <p>{feature.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
