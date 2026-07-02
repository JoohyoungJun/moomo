import Link from 'next/link';
import { AuthSection } from './AuthSection';
import * as styles from './Header.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Moomo
        </Link>

        <nav className={styles.nav}>
          <Link href="/posts" className={styles.navLink}>
            게시판
          </Link>
          <Link href="/posts/new" className={styles.navLinkPrimary}>
            글쓰기
          </Link>
        </nav>

        <AuthSection />
      </div>
    </header>
  );
}
