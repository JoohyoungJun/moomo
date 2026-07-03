'use client';

import { FormEvent, useState } from 'react';
import ModalLayout from '../modal-layout/ModalLayout';
import * as styles from './AccountDeleteModal.css';

type AccountDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  isPending?: boolean;
  error?: string;
};

export default function AccountDeleteModal({
  open,
  onClose,
  onSubmit,
  isPending = false,
  error,
}: AccountDeleteModalProps) {
  const [password, setPassword] = useState('');

  if (!open) return null;

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  return (
    <ModalLayout onClose={handleClose} titleId="account-delete-title">
      <h2 id="account-delete-title" className={styles.title}>
        회원탈퇴
      </h2>
      <p className={styles.description}>
        회원탈퇴 시 모든 데이터가 삭제됩니다.
        <br />
        본인 확인을 위해 비밀번호를 입력해 주세요.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="delete-account-password">
            비밀번호
          </label>
          <input
            id="delete-account-password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
            disabled={isPending}
          >
            취소
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isPending || !password.trim()}
          >
            {isPending ? '처리 중...' : '회원탈퇴'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
