import { globalStyle } from '@vanilla-extract/css';

globalStyle('body', {
  margin: 0,
  minHeight: '100svh',
  display: 'flex',
  flexDirection: 'column',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  backgroundColor: '#f8f9fb',
  color: '#111827',
});

globalStyle('main', {
  flex: 1,
  width: '100%',
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '32px 24px',
});
