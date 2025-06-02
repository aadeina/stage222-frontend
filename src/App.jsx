import AppRoutes from '@/router/AppRoutes';
import { Toaster } from 'react-hot-toast';

const App = () => {
    return (
        <>
            <AppRoutes />
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </>
    );
};

export default App;
