import { Header } from '@/components/header/Header';
import * as styles from '../layout.css';

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className={styles.content}>{children}</div>
    </>
  );
}
