import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  gap: '8px',
  boxSizing: 'border-box',
  padding: '16px 24px',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
});

export const title = style({
  margin: 0,
  fontSize: '22px',
  fontWeight: 700,
  color: colors.text,
});

export const description = style({
  margin: 0,
  fontSize: '14px',
  color: colors.textMuted,
  flexShrink: 0,
});

export const searchForm = style({
  display: 'flex',
  gap: '8px',
  flexShrink: 0,
});

export const searchInput = style({
  flex: 1,
  height: '40px',
  padding: '0 12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: colors.text,
  backgroundColor: colors.background,
});

export const searchButton = style({
  height: '40px',
  padding: '0 16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  backgroundColor: colors.background,
  color: colors.text,
  fontSize: '14px',
  cursor: 'pointer',
  flexShrink: 0,

  ':hover': {
    backgroundColor: colors.surface,
    borderColor: '#d1d5db',
  },
});

export const searchResetButton = style({
  height: '40px',
  padding: '0 12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  backgroundColor: colors.background,
  color: colors.textMuted,
  fontSize: '14px',
  cursor: 'pointer',
  flexShrink: 0,

  ':hover': {
    backgroundColor: colors.surface,
    borderColor: '#d1d5db',
  },
});

export const list = style({
  display: 'grid',
  gridTemplateRows: 'repeat(4, 1fr)',
  gap: '8px',
  flex: 1,
  minHeight: 0,
});

export const card = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minHeight: 0,
  overflow: 'hidden',
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

export const cardContent = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: 0,
});

export const cardThumbnail = style({
  flexShrink: 0,
  width: '72px',
  height: '72px',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: 'inherit',
});

export const cardThumbnailImage = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const cardTitle = style({
  margin: '0 0 4px',
  fontSize: '16px',
  fontWeight: 600,
  color: colors.text,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const cardMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
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
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.textMuted,
  fontSize: '14px',
});

export const pagination = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
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
