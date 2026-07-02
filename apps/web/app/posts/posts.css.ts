import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
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

export const description = style({
  margin: 0,
  fontSize: '14px',
  color: colors.textMuted,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const card = style({
  display: 'block',
  padding: '16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  backgroundColor: colors.background,
  textDecoration: 'none',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',

  ':hover': {
    backgroundColor: colors.surface,
    borderColor: '#d1d5db',
  },
});

export const cardTitle = style({
  margin: '0 0 8px',
  fontSize: '17px',
  fontWeight: 600,
  color: colors.text,
});

export const cardMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '10px',
  fontSize: '13px',
  color: colors.textMuted,
});

export const cardStats = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '13px',
  color: colors.textMuted,
});

export const state = style({
  margin: 0,
  padding: '24px 0',
  textAlign: 'center',
  color: colors.textMuted,
  fontSize: '14px',
});

export const pagination = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  paddingTop: '8px',
});

export const pageButton = style({
  height: '36px',
  minWidth: '64px',
  padding: '0 12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  backgroundColor: colors.background,
  color: colors.text,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',

  ':hover': {
    backgroundColor: colors.surface,
    borderColor: '#d1d5db',
  },

  ':disabled': {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
});

export const pageInfo = style({
  minWidth: '64px',
  textAlign: 'center',
  fontSize: '14px',
  color: colors.textMuted,
});
