import * as styles from './landing-page.css';

const features = [
  {
    title: '게시판',
    description: '무인매장 운영 이야기와 실무 팁을 나눠요.',
  },
  {
    title: '소통',
    description: '댓글로 의견을 주고받으며 함께 고민해요.',
  },
  {
    title: '알림',
    description: '내 글에 반응이 오면 바로 알려줘요.',
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
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
