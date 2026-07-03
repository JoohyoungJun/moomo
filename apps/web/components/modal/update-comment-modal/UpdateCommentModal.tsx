'use client';

import { FormEvent, useState } from 'react';
import * as styles from './UpdateCommentModal.css';

type UpdateCommentModalProps = {
  open: boolean;
  initialContent: string;
  onClose: () => void;
  onSubmit: (content: string) => void;
  isPending?: boolean;
  error?: string;
};

export default function UpdateCommentModal({
  open,
  initialContent,
  onClose,
  onSubmit,
  isPending = false,
  error,
}: UpdateCommentModalProps) {
  const [content, setContent] = useState(initialContent);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-comment-title"
      >
        <h2 id="update-comment-title" className={styles.title}>
          댓글 수정
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="댓글을 입력하세요"
            maxLength={200}
            required
            autoFocus
          />

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isPending}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isPending || !content.trim()}
            >
              {isPending ? '수정 중...' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
