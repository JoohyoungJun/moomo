import { colors } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const title = style({
  margin: '0 0 8px',
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
  gap: '16px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const label = style({
  fontSize: '14px',
  fontWeight: 500,
  color: colors.text,
});

export const input = style({
  height: '44px',
  padding: '0 12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: colors.text,
  backgroundColor: colors.background,
  outline: 'none',

  ':focus': {
    borderColor: colors.primary,
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  },

  ':disabled': {
    backgroundColor: colors.surface,
    color: colors.textMuted,
    cursor: 'not-allowed',
  },
});

export const error = style({
  margin: 0,
  fontSize: '14px',
  color: colors.danger,
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
