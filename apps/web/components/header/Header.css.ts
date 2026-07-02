import { style } from '@vanilla-extract/css';
import { colors, layout } from '@/styles/theme.css';

export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: 100,
  flexShrink: 0,
  height: layout.headerHeight,
  backgroundColor: colors.background,
  borderBottom: `1px solid ${colors.border}`,
  overflow: 'visible',
});

export const inner = style({
  maxWidth: layout.maxWidth,
  height: '100%',
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '24px',
  overflow: 'visible',
});

export const logo = style({
  flexShrink: 0,
  fontSize: '20px',
  fontWeight: 700,
  color: colors.text,
  textDecoration: 'none',
  letterSpacing: '-0.02em',

  ':hover': {
    color: colors.primary,
  },
});

export const nav = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flex: 1,
  minWidth: 0,
  flexWrap: 'nowrap',
});

export const navLink = style({
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.textMuted,
  textDecoration: 'none',
  transition: 'background-color 0.15s ease, color 0.15s ease',

  whiteSpace: 'nowrap',
  flexShrink: 0,

  ':hover': {
    backgroundColor: colors.surface,
    color: colors.text,
  },
});

export const navLinkPrimary = style([
  navLink,
  {
    color: colors.primary,
    ':hover': {
      backgroundColor: '#eff6ff',
      color: colors.primary,
    },
  },
]);

export const authGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  overflow: 'visible',
});
