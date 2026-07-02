import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const bellRoot = style({
  position: 'relative',
});

export const bellButton = style({
  position: 'relative',
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

export const unreadDot = style({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '8px',
  height: '8px',
  borderRadius: '999px',
  backgroundColor: '#ef4444',
  border: `2px solid ${colors.background}`,
});

export const dropdown = style({
  position: 'fixed',
  zIndex: 200,
  width: '280px',
  padding: '4px',
  backgroundColor: colors.background,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
});

export const dropdownHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px 4px',
});

export const dropdownTitle = style({
  margin: 0,
  fontSize: '13px',
  fontWeight: 600,
  color: colors.textMuted,
});

export const markAllButton = style({
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
  fontSize: '12px',
  fontWeight: 500,
  color: colors.primary,
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'underline',
  },
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  maxHeight: '320px',
  overflowY: 'auto',
  padding: '0 4px 4px',

  // Firefox
  scrollbarWidth: 'thin',
  scrollbarColor: `${colors.border} transparent`,

  // Chrome, Safari
  selectors: {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: colors.border,
      borderRadius: '999px',
    },
  },
});

export const empty = style({
  margin: 0,
  padding: '16px 12px',
  fontSize: '14px',
  color: colors.textMuted,
  textAlign: 'center',
});

export const item = style({
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  border: 'none',
  borderRadius: '6px',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
});

export const itemUnread = style([
  item,
  {
    backgroundColor: '#eff6ff',

    ':hover': {
      backgroundColor: '#dbeafe',
    },
  },
]);

export const itemRead = style([
  item,
  {
    backgroundColor: 'transparent',

    ':hover': {
      backgroundColor: colors.surface,
    },
  },
]);

export const itemMessage = style({
  margin: '0 0 4px',
  fontSize: '13px',
  lineHeight: 1.4,
});

export const itemMessageRead = style([
  itemMessage,
  {
    color: colors.textMuted,
    fontWeight: 400,
  },
]);

export const itemMessageUnread = style([
  itemMessage,
  {
    color: colors.text,
    fontWeight: 500,
  },
]);

export const itemTime = style({
  fontSize: '12px',
  color: colors.textMuted,
});
