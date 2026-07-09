'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import * as styles from './NewProductModal.css';
import ModalLayout from '../modal-layout/ModalLayout';
import Image from 'next/image';

const MAX_IMAGES = 10;

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: { url: string }[];
};

type ProductFormInitialValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrls?: string[];
};

type NewProductModalProps = {
  open: boolean;
  mode?: 'create' | 'edit';
  initialValues?: ProductFormInitialValues;
  onClose: () => void;
  onSubmit: (product: ProductFormValues) => void;
  isPending?: boolean;
  error?: string;
};

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = (await response.json()) as { url?: string; message?: string };
  if (!response.ok || !data.url) {
    throw new Error(data.message ?? '이미지 업로드에 실패했습니다.');
  }

  return data.url;
}

export default function NewProductModal({
  open,
  mode = 'create',
  initialValues,
  onClose,
  onSubmit,
  isPending = false,
  error = '',
}: NewProductModalProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [price, setPrice] = useState(
    initialValues ? String(initialValues.price) : '',
  );
  const [stock, setStock] = useState(
    initialValues ? String(initialValues.stock) : '',
  );
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    initialValues?.imageUrls ?? [],
  );
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviewUrls, setNewImagePreviewUrls] = useState<string[]>([]);
  const [imagesTouched, setImagesTouched] = useState(false);
  const [imageError, setImageError] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);

  const isEditMode = mode === 'edit';
  const totalImageCount = existingImageUrls.length + newImageFiles.length;

  const revokePreviewUrls = (urls: string[]) => {
    urls.forEach((url) => URL.revokeObjectURL(url));
  };

  const resetForm = () => {
    revokePreviewUrls(newImagePreviewUrls);
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setExistingImageUrls([]);
    setNewImageFiles([]);
    setNewImagePreviewUrls([]);
    setImagesTouched(false);
    setImageError('');
  };

  if (!open) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) return;

    const invalidFile = files.find((file) => !file.type.startsWith('image/'));
    if (invalidFile) {
      setImageError('이미지 파일만 선택할 수 있습니다.');
      return;
    }

    if (totalImageCount + files.length > MAX_IMAGES) {
      setImageError(`이미지는 최대 ${MAX_IMAGES}장까지 등록할 수 있습니다.`);
      return;
    }

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setImageError('');
    setImagesTouched(true);
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviewUrls((prev) => [...prev, ...previewUrls]);
  };

  const handleRemoveExistingImage = (index: number) => {
    setImagesTouched(true);
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setImagesTouched(true);
    URL.revokeObjectURL(newImagePreviewUrls[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!trimmedName || !trimmedDescription) return;
    if (!Number.isFinite(parsedPrice) || !Number.isFinite(parsedStock)) return;

    let uploadedUrls: string[] = [];

    if (newImageFiles.length > 0) {
      setIsImageUploading(true);
      setImageError('');

      try {
        uploadedUrls = await Promise.all(newImageFiles.map(uploadImage));
      } catch (uploadError) {
        setImageError(
          uploadError instanceof Error
            ? uploadError.message
            : '이미지 업로드에 실패했습니다.',
        );
        setIsImageUploading(false);
        return;
      } finally {
        setIsImageUploading(false);
      }
    }

    const allImageUrls = [...existingImageUrls, ...uploadedUrls];
    const payload: ProductFormValues = {
      name: trimmedName,
      description: trimmedDescription,
      price: parsedPrice,
      stock: parsedStock,
    };

    if (!isEditMode && allImageUrls.length > 0) {
      payload.images = allImageUrls.map((url) => ({ url }));
    }

    if (isEditMode && imagesTouched) {
      payload.images = allImageUrls.map((url) => ({ url }));
    }

    onSubmit(payload);
  };

  return (
    <ModalLayout onClose={handleClose} titleId="new-product-title">
      <h2 id="new-product-title" className={styles.title}>
        {isEditMode ? '상품 수정' : '상품 등록'}
      </h2>
      <p className={styles.description}>
        {isEditMode
          ? '수정할 상품 정보를 입력해 주세요.'
          : '등록할 상품 정보를 입력해 주세요.'}
      </p>

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
            상품 이미지 (선택, 여러 장 가능)
          </label>
          <input
            id="new-product-image"
            type="file"
            accept="image/*"
            multiple
            className={styles.fileInput}
            onChange={handleImageChange}
            disabled={isPending || isImageUploading || totalImageCount >= MAX_IMAGES}
          />
          {totalImageCount > 0 && (
            <div className={styles.previewList}>
              {existingImageUrls.map((url, index) => (
                <div key={`existing-${url}-${index}`} className={styles.previewItem}>
                  <Image
                    src={url}
                    alt={`기존 상품 이미지 ${index + 1}`}
                    width={480}
                    height={180}
                    unoptimized
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleRemoveExistingImage(index)}
                    disabled={isPending || isImageUploading}
                  >
                    삭제
                  </button>
                </div>
              ))}
              {newImagePreviewUrls.map((url, index) => (
                <div key={`new-${url}`} className={styles.previewItem}>
                  <Image
                    src={url}
                    alt={`새 상품 이미지 ${index + 1}`}
                    width={480}
                    height={180}
                    unoptimized
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleRemoveNewImage(index)}
                    disabled={isPending || isImageUploading}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
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
            {isImageUploading
              ? '이미지 업로드 중...'
              : isPending
                ? isEditMode
                  ? '수정 중...'
                  : '등록 중...'
                : isEditMode
                  ? '수정'
                  : '등록'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
