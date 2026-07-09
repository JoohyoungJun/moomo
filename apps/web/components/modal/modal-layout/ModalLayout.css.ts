import { colors } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  backgroundColor: 'rgba(17, 24, 39, 0.45)',
});

export const modal = style({
  width: '100%',
  maxWidth: '480px',
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: '24px',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  backgroundColor: colors.background,
  boxShadow: '0 20px 40px rgba(17, 24, 39, 0.12)',

  scrollbarWidth: 'thin',
  scrollbarColor: `${colors.border} transparent`,
});
