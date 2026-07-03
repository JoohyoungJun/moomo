import * as styles from './DeleteModal.css';
import ModalLayout from '../modal-layout/ModalLayout';
import { DeleteTarget } from '@/components/posts/post-detail/PostDetailPage';

type DeleteModalProps = {
  open: boolean;
  target: DeleteTarget;
  onClose: () => void;
  onSubmit: () => void;
  isPending?: boolean;
  error?: string;
};

export default function DeleteModal({
  open,
  target,
  onClose,
  onSubmit,
  isPending = false,
  error,
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <ModalLayout onClose={onClose} titleId="delete-title">
      <h2 id="delete-title" className={styles.title}>
        {target.type === 'post' ? '게시글' : '댓글'} 삭제
      </h2>
      <p className={styles.description}>
        삭제하면 복구할 수 없습니다.
        <br />
        정말 삭제하시겠습니까?
      </p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          취소
        </button>
        <button
          type="button"
          className={styles.submitButton}
          onClick={onSubmit}
          disabled={isPending}
        >
          삭제
        </button>
      </div>
    </ModalLayout>
  );
}
