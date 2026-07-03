import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const backLink = style({
  fontSize: '14px',
  color: colors.textMuted,
  textDecoration: 'none',

  ':hover': {
    color: colors.text,
  },
});

export const postCard = style({
  padding: '24px',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  backgroundColor: colors.background,
});

export const title = style({
  margin: '0 0 12px',
  fontSize: '28px',
  fontWeight: 700,
  color: colors.text,
  lineHeight: 1.4,
});

export const meta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '20px',
  fontSize: '14px',
  color: colors.textMuted,
});

export const ownerAction = style({
  fontSize: '12px',
  color: colors.primary,
  textDecoration: 'none',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'underline',
  },
});

export const ownerActionDanger = style({
  border: 'none',
  padding: 0,
  background: 'none',
  fontSize: '12px',
  color: '#dc2626',
  cursor: 'pointer',
});

export const content = style({
  margin: '0 0 20px',
  fontSize: '16px',
  lineHeight: 1.7,
  color: colors.text,
  whiteSpace: 'pre-wrap',
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const actionStat = style({
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  fontSize: '14px',
  color: colors.textMuted,
});

export const likeButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  height: '36px',
  padding: '0 14px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  backgroundColor: colors.background,
  fontSize: '14px',
  fontWeight: 500,
  color: colors.textMuted,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',

  ':hover': {
    backgroundColor: colors.surface,
  },
});

export const likeButtonActive = style([
  likeButton,
  {
    color: '#dc2626',
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
]);

export const commentsSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const commentsTitle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 600,
  color: colors.text,
});

export const commentForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const commentInput = style({
  minHeight: '80px',
  padding: '12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: 1.5,
  resize: 'vertical',
  outline: 'none',

  ':focus': {
    borderColor: colors.primary,
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  },
});

export const commentSubmit = style({
  alignSelf: 'flex-end',
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

export const commentList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const commentItem = style({
  padding: '14px 16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  backgroundColor: colors.background,
});

export const commentMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
  fontSize: '13px',
  color: colors.textMuted,
});

export const commentContent = style({
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.6,
  color: colors.text,
  whiteSpace: 'pre-wrap',
});

export const state = style({
  margin: 0,
  padding: '16px 0',
  textAlign: 'center',
  fontSize: '14px',
  color: colors.textMuted,
});

export const loginHint = style({
  margin: 0,
  fontSize: '14px',
  color: colors.textMuted,
});

export const pagination = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
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
