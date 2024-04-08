import { Route, Routes } from 'react-router-dom';
import { useCheckIsAdmin } from './hooks/useCheckIsAdmin';
import AdminPage from './pages/AdminPage';
import AuthorizationPage from './pages/AuthorizationPage';
import CategoriesPage from './pages/CategoriesPage';
import DatePage from './pages/DatePage';
import FirstPage from './pages/FirstPage';

function App() {
  useCheckIsAdmin();
  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/date" element={<DatePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/sign-in" element={<AuthorizationPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
    </Routes>
  );
}

export default App;
