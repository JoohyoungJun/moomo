import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  padding: '16px',
  textAlign: 'center',
});

export const badge = style({
  display: 'inline-block',
  marginBottom: '16px',
  padding: '6px 12px',
  borderRadius: '999px',
  backgroundColor: '#eff6ff',
  color: colors.primary,
  fontSize: '13px',
  fontWeight: 600,
});

export const title = style({
  margin: '0 0 16px',
  fontSize: '48px',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: colors.text,
});

export const description = style({
  margin: '0 0 48px',
  maxWidth: '480px',
  fontSize: '18px',
  lineHeight: 1.6,
  color: colors.textMuted,
});

export const featureGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  width: '100%',
  maxWidth: '720px',

  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const featureCard = style({
  padding: '24px',
  backgroundColor: colors.background,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  textAlign: 'left',
});

export const featureTitle = style({
  margin: '0 0 8px',
  fontSize: '16px',
  fontWeight: 600,
  color: colors.text,
});

export const featureDescription = style({
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.5,
  color: colors.textMuted,
});
