import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Toaster position='top-center' toastOptions={{ duration: 3000 }} />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
