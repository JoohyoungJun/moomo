import * as styles from './OrderModal.css';
import ModalLayout from '../modal-layout/ModalLayout';

type OrderModalProps = {
  open: boolean;
  name: string;
  productId: string;
  quantity: number;
  maxQuantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  isPending?: boolean;
  error?: string;
};

export default function OrderModal({
  open,
  name,
  quantity = 1,
  maxQuantity,
  onIncrease,
  onDecrease,
  onClose,
  onSubmit,
  isPending = false,
  error = '',
}: OrderModalProps) {
  if (!open) return null;

  return (
    <ModalLayout onClose={onClose} titleId="order-title">
      <h2 id="order-title" className={styles.title}>
        {name} 주문하기
      </h2>
      <p className={styles.description}>수량을 선택한 후, 주문해주세요.</p>
      <div className={styles.quantity}>
        <button
          type="button"
          className={styles.quantityButton}
          onClick={onDecrease}
          disabled={isPending || quantity <= 1}
        >
          -
        </button>
        <span className={styles.quantityValue}>{quantity}</span>
        <button
          type="button"
          className={styles.quantityButton}
          onClick={onIncrease}
          disabled={isPending || quantity >= maxQuantity}
        >
          +
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          취소
        </button>
        <button
          type="button"
          className={styles.submitButton}
          onClick={() => onSubmit(quantity)}
          disabled={isPending}
        >
          주문
        </button>
      </div>
    </ModalLayout>
  );
}
