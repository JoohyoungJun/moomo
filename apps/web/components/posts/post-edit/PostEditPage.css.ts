import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  gap: '16px',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const title = style({
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  color: colors.text,
});

export const backLink = style({
  fontSize: '14px',
  color: colors.textMuted,
  textDecoration: 'none',

  ':hover': {
    color: colors.text,
  },
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  backgroundColor: colors.background,
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
});

export const textarea = style({
  minHeight: '240px',
  padding: '12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: 1.6,
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

export const state = style({
  margin: 0,
  fontSize: '14px',
  color: colors.textMuted,
});

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
});

export const cancelButton = style({
  height: '40px',
  padding: '0 16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  backgroundColor: colors.background,
  fontSize: '14px',
  fontWeight: 500,
  color: colors.text,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',

  ':hover': {
    backgroundColor: colors.surface,
  },
});

export const submitButton = style({
  height: '40px',
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
