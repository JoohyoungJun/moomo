import { globalStyle } from '@vanilla-extract/css';

globalStyle('body', {
  margin: 0,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  backgroundColor: '#f8f9fb',
  color: '#111827',
});

globalStyle('main', {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '32px 24px',
});
