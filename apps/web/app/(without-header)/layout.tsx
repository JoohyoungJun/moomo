import Link from 'next/link';
import * as styles from './layout.css';

export default function WithoutHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.auth}>
      <div className={styles.center}>
        <Link href="/" className={styles.logo}>
          Moomo
        </Link>
        {children}
      </div>
    </div>
  );
}
