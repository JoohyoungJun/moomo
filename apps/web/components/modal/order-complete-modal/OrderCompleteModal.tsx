import ModalLayout from '../modal-layout/ModalLayout';
import * as styles from './OrderCompleteModal.css';

type OrderCompleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function OrderCompleteModal({
  open,
  onClose,
  onConfirm,
}: OrderCompleteModalProps) {
  if (!open) return null;

  return (
    <ModalLayout onClose={onClose} titleId="order-complete-title">
      <h2 id="order-complete-title" className={styles.title}>
        주문이 완료되었습니다.
      </h2>
      <p className={styles.description}>
        주문 내역은 마이페이지에서 확인하실 수 있습니다.
      </p>
      <button type="button" className={styles.submitButton} onClick={onConfirm}>
        확인
      </button>
    </ModalLayout>
  );
}
