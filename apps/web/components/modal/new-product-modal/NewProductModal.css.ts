import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const title = style({
  margin: '0 0 16px',
  fontSize: '18px',
  fontWeight: 600,
  color: colors.text,
});

export const description = style({
  margin: '0 0 24px',
  fontSize: '14px',
  lineHeight: 1.6,
  color: colors.textMuted,
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const label = style({
  fontSize: '13px',
  fontWeight: 600,
  color: colors.text,
});

export const input = style({
  height: '40px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  padding: '0 12px',
  backgroundColor: colors.background,
  color: colors.text,
  fontSize: '14px',

  ':focus': {
    outline: 'none',
    borderColor: colors.primary,
  },
});

export const textarea = style({
  minHeight: '96px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  padding: '10px 12px',
  backgroundColor: colors.background,
  color: colors.text,
  fontSize: '14px',
  resize: 'vertical',

  ':focus': {
    outline: 'none',
    borderColor: colors.primary,
  },
});

export const fileInput = style({
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  padding: '8px 10px',
  backgroundColor: colors.background,
  color: colors.text,
  fontSize: '13px',
});

export const previewImage = style({
  width: '100%',
  maxHeight: '180px',
  objectFit: 'cover',
  borderRadius: '8px',
  border: `1px solid ${colors.border}`,
});

export const numberRow = style({
  display: 'flex',
  gap: '12px',
});

export const error = style({
  margin: 0,
  fontSize: '14px',
  color: '#dc2626',
});

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '4px',
});

export const cancelButton = style({
  height: '40px',
  padding: '0 20px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  backgroundColor: colors.background,
  color: colors.text,
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',

  ':hover': {
    backgroundColor: colors.surface,
    borderColor: '#d1d5db',
  },

  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

export const submitButton = style({
  height: '40px',
  padding: '0 20px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: colors.primary,
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',

  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});
