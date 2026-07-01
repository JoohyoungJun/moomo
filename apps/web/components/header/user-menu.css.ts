import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const menuRoot = style({
  position: 'relative',
});

export const userButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  border: `1px solid ${colors.border}`,
  borderRadius: '999px',
  backgroundColor: colors.background,
  color: colors.textMuted,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',

  ':hover': {
    backgroundColor: colors.surface,
    borderColor: '#d1d5db',
  },
});

export const dropdown = style({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  minWidth: '160px',
  padding: '8px',
  backgroundColor: colors.background,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
});

export const dropdownItem = style({
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.text,
  textAlign: 'left',
  textDecoration: 'none',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: colors.surface,
  },
});

export const dropdownButton = style([
  dropdownItem,
  {
    color: '#dc2626',
  },
]);
