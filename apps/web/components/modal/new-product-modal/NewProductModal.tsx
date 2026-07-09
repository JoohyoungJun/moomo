'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import * as styles from './NewProductModal.css';
import ModalLayout from '../modal-layout/ModalLayout';
import Image from 'next/image';

type NewProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: { url: string }[];
};

type NewProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: NewProduct) => void;
  isPending?: boolean;
  error?: string;
};

export default function NewProductModal({
  open,
  onClose,
  onSubmit,
  isPending = false,
  error = '',
}: NewProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setImageFile(null);
    setImagePreviewUrl('');
    setImageError('');
    onClose();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreviewUrl('');
      setImageError('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('이미지 파일만 선택할 수 있습니다.');
      setImageFile(null);
      setImagePreviewUrl('');
      return;
    }

    setImageError('');
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!trimmedName || !trimmedDescription) return;
    if (!Number.isFinite(parsedPrice) || !Number.isFinite(parsedStock)) return;

    let imageUrl: string | undefined;
    if (imageFile) {
      setIsImageUploading(true);
      setImageError('');
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = (await response.json()) as { url?: string; message?: string };
        if (!response.ok || !data.url) {
          setImageError(data.message ?? '이미지 업로드에 실패했습니다.');
          setIsImageUploading(false);
          return;
        }

        imageUrl = data.url;
      } catch {
        setImageError('이미지 업로드에 실패했습니다.');
        setIsImageUploading(false);
        return;
      } finally {
        setIsImageUploading(false);
      }
    }

    onSubmit({
      name: trimmedName,
      description: trimmedDescription,
      price: parsedPrice,
      stock: parsedStock,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    });
  };

  return (
    <ModalLayout onClose={handleClose} titleId="new-product-title">
      <h2 id="new-product-title" className={styles.title}>
        상품 등록
      </h2>
      <p className={styles.description}>등록할 상품 정보를 입력해 주세요.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-product-name">
            상품명
          </label>
          <input
            id="new-product-name"
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-product-description">
            상품 설명
          </label>
          <textarea
            id="new-product-description"
            className={styles.textarea}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={1000}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-product-price">
            가격
          </label>
          <input
            id="new-product-price"
            type="number"
            className={styles.input}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            min={1}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-product-stock">
            재고
          </label>
          <input
            id="new-product-stock"
            type="number"
            className={styles.input}
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            min={0}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="new-product-image">
            상품 이미지 (선택)
          </label>
          <input
            id="new-product-image"
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImageChange}
            disabled={isPending || isImageUploading}
          />
          {imagePreviewUrl && (
            <Image
              src={imagePreviewUrl}
              alt="상품 이미지 미리보기"
              width={480}
              height={180}
              unoptimized
              className={styles.previewImage}
            />
          )}
        </div>

        {imageError && <p className={styles.error}>{imageError}</p>}
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
            disabled={
              isPending ||
              isImageUploading ||
              !name.trim() ||
              !description.trim() ||
              !price.trim() ||
              !stock.trim()
            }
          >
            {isImageUploading ? '이미지 업로드 중...' : isPending ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
