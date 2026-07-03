import React from 'react';
import * as styles from './ModalLayout.css';

type ModalLayoutProps = {
  onClose: () => void;
  children: React.ReactNode;
  titleId?: string;
};

export default function ModalLayout({
  onClose,
  children,
  titleId,
}: ModalLayoutProps) {
  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {children}
      </div>
    </div>
  );
}
