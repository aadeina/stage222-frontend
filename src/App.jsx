import AppRoutes from '@/router/AppRoutes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}
