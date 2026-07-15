import { colors } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const auth = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '16px',
});

export const center = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
  maxWidth: '400px',
  flexShrink: 0,
});

export const logo = style({
  margin: 0,
  textAlign: 'center',
  fontSize: '44px',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: colors.text,
  textDecoration: 'none',

  ':hover': {
    color: colors.primary,
  },
});
