import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  backgroundColor: 'rgba(17, 24, 39, 0.45)',
});

export const modal = style({
  width: '100%',
  maxWidth: '480px',
  padding: '24px',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  backgroundColor: colors.background,
  boxShadow: '0 20px 40px rgba(17, 24, 39, 0.12)',
});

export const title = style({
  margin: '0 0 16px',
  fontSize: '18px',
  fontWeight: 600,
  color: colors.text,
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const textarea = style({
  minHeight: '120px',
  padding: '12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: 1.5,
  color: colors.text,
  backgroundColor: colors.background,
  resize: 'vertical',
  outline: 'none',

  ':focus': {
    borderColor: colors.primary,
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  },
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
  height: '36px',
  padding: '0 16px',
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
  height: '36px',
  padding: '0 16px',
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
