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

export const quantity = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
});

export const quantityButton = style({
  width: '32px',
  height: '32px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  backgroundColor: colors.background,
  color: colors.text,
  fontSize: '18px',
  lineHeight: 1,
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

export const quantityValue = style({
  minWidth: '24px',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: 600,
  color: colors.text,
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
  backgroundColor: colors.danger,
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',

  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});
