import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  backgroundColor: colors.background,
  overflow: 'hidden',
});

export const layout = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
});

export const nav = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '25%',
  flexShrink: 0,
  padding: '20px 12px',
  borderRight: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
});

export const navItem = style({
  display: 'block',
  width: '100%',
  padding: '12px 16px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.textMuted,
  textAlign: 'left',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease',

  ':hover': {
    backgroundColor: colors.background,
    color: colors.text,
  },
});

export const navItemActive = style([
  navItem,
  {
    backgroundColor: colors.background,
    color: colors.text,
    fontWeight: 600,
    boxShadow: `inset 0 0 0 1px ${colors.border}`,
  },
]);

export const content = style({
  flex: 1,
  minWidth: 0,
  padding: '24px',
  overflow: 'auto',
});

export const sectionTitle = style({
  margin: '0 0 8px',
  fontSize: '20px',
  fontWeight: 700,
  color: colors.text,
});

export const sectionDescription = style({
  margin: '0 0 24px',
  fontSize: '14px',
  color: colors.textMuted,
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxWidth: '480px',
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

export const submitButton = style({
  alignSelf: 'flex-start',
  height: '40px',
  padding: '0 20px',
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

export const state = style({
  margin: 0,
  fontSize: '14px',
  color: colors.textMuted,
});

export const error = style({
  margin: 0,
  fontSize: '14px',
  color: '#dc2626',
});

export const success = style({
  margin: 0,
  fontSize: '14px',
  color: '#16a34a',
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '8px',
});

export const listItem = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '12px 16px',
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

export const listItemTitle = style({
  margin: '0 0 4px',
  fontSize: '16px',
  fontWeight: 600,
  color: colors.text,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const listItemContent = style({
  margin: '0 0 4px',
  fontSize: '14px',
  lineHeight: 1.5,
  color: colors.textMuted,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const listItemMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
  fontSize: '13px',
  color: colors.textMuted,
});

export const listItemStats = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '13px',
  color: colors.textMuted,
});

export const pagination = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginTop: '16px',
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
