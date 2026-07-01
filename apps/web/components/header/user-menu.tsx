'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import * as styles from './user-menu.css';

type Props = {
  nickname: string;
};

export function UserMenu({ nickname }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await apiFetch('/auth/sign-out', { method: 'POST' });
    await queryClient.invalidateQueries({ queryKey: ['me'] });
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <div className={styles.menuRoot} ref={rootRef}>
      <button
        type="button"
        className={styles.userButton}
        aria-label="사용자 메뉴"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* 유저 아이콘 (SVG) */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <p
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              color: '#6b7280',
              margin: 0,
            }}
          >
            {nickname}
          </p>
          <Link
            href="/me"
            className={styles.dropdownItem}
            onClick={() => setOpen(false)}
          >
            내 정보
          </Link>
          <button
            type="button"
            className={styles.dropdownButton}
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
