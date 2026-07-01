import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const page = style({
  minHeight: 'calc(100vh - 64px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
});

export const card = style({
  width: '100%',
  maxWidth: '400px',
  padding: '32px',
  backgroundColor: colors.background,
  border: `1px solid ${colors.border}`,
  borderRadius: '16px',
});

export const title = style({
  margin: '0 0 8px',
  fontSize: '24px',
  fontWeight: 700,
  color: colors.text,
});

export const subtitle = style({
  margin: '0 0 24px',
  fontSize: '14px',
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
});

export const error = style({
  margin: 0,
  fontSize: '14px',
  color: '#dc2626',
});

export const submitButton = style({
  height: '44px',
  marginTop: '8px',
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

export const footer = style({
  marginTop: '24px',
  fontSize: '14px',
  color: colors.textMuted,
  textAlign: 'center',
});

export const footerLink = style({
  color: colors.primary,
  fontWeight: 500,
  textDecoration: 'none',
});
