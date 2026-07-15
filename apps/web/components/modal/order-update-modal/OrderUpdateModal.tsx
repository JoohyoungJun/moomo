'use client';
import {
  Order,
  UpdateOrderStatusBody,
} from '@/components/admin/admin-me/AdminMePage';
import ModalLayout from '../modal-layout/ModalLayout';
import * as styles from './OrderUpdateModal.css';
import { useState } from 'react';
import { ORDER_STATUS } from '@/components/me/MePage';

type OrderUpdateModalProps = {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onSubmit: (body: UpdateOrderStatusBody) => void;
  isPending?: boolean;
  error?: string;
};

export default function OrderUpdateModal({
  open,
  order,
  onClose,
  onSubmit,
  isPending,
  error,
}: OrderUpdateModalProps) {
  const [status, setStatus] = useState(order?.status ?? 'pending');

  if (!open || !order) return null;

  const handleSubmit = () => {
    onSubmit({ status });
  };

  return (
    <ModalLayout onClose={onClose} titleId="order-update-title">
      <h2 id="order-update-title" className={styles.title}>
        {order.productName}{' '}
        <span className={styles.description}>주문 상태 변경</span>
      </h2>
      <p className={styles.description}>
        <span className={styles.bold}>{order.userNickname}</span> 님의{' '}
        <span className={styles.bold}>{order.productName}</span> 물품{' '}
        <span className={styles.bold}>{order.quantity}</span> 개 주문
      </p>
      <div className={styles.field}>
        <label htmlFor="order-status" className={styles.label}>
          주문 상태
        </label>
        <select
          id="order-status"
          className={styles.select}
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as UpdateOrderStatusBody['status'])
          }
          disabled={isPending}
        >
          {ORDER_STATUS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button
          className={styles.cancelButton}
          onClick={onClose}
          disabled={isPending}
        >
          취소
        </button>
        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isPending || status === order.status}
        >
          변경
        </button>
      </div>
    </ModalLayout>
  );
}
