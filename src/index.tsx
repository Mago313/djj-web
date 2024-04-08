import ReactDOM from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AdminProvider } from './hooks/useAdminContext';
import { ModalProvider } from './hooks/useModalVisible';
import { StateProvider } from './hooks/useStateContext';
import './index.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AdminProvider>
        <ModalProvider>
          <StateProvider>
            <App />
          </StateProvider>
        </ModalProvider>
      </AdminProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
