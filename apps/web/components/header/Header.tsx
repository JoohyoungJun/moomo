'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthSection } from './AuthSection';
import * as styles from './Header.css';

export function Header() {
  const pathname = usePathname();
  const isPostsActive = pathname.startsWith('/posts') && pathname !== '/posts/new';
  const isProductsActive = pathname.startsWith('/products');
  const isWriteActive = pathname === '/posts/new';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Moomo
        </Link>

        <nav className={styles.nav}>
          <Link
            href="/posts"
            className={isPostsActive ? styles.navLinkPrimary : styles.navLink}
          >
            게시판
          </Link>
          <Link
            href="/products"
            className={isProductsActive ? styles.navLinkPrimary : styles.navLink}
          >
            무모 상품
          </Link>
          <Link
            href="/posts/new"
            className={isWriteActive ? styles.navLinkPrimary : styles.navLink}
          >
            글쓰기
          </Link>
        </nav>

        <AuthSection />
      </div>
    </header>
  );
}
