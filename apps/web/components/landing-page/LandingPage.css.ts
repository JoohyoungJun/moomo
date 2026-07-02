import { style } from '@vanilla-extract/css';
import { colors } from '@/styles/theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '16px 24px',
  textAlign: 'center',
});

export const badge = style({
  display: 'inline-block',
  marginBottom: '12px',
  padding: '6px 12px',
  borderRadius: '999px',
  backgroundColor: '#eff6ff',
  color: colors.primary,
  fontSize: '13px',
  fontWeight: 600,
});

export const title = style({
  margin: '0 0 12px',
  fontSize: '44px',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: colors.text,
});

export const description = style({
  margin: '0 0 24px',
  maxWidth: '480px',
  fontSize: '17px',
  lineHeight: 1.6,
  color: colors.textMuted,
});

export const featureGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  width: '100%',
  maxWidth: '720px',
  flexShrink: 0,

  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const featureCard = style({
  padding: '20px',
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
