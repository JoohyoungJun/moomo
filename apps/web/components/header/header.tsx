import Link from 'next/link';
import { AuthSection } from './auth-section';
import * as styles from './header.css';

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
