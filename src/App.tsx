import { useEffect } from 'react';
import DatePage from './pages/DatePage';
import FirstPage from './pages/FirstPage';
import AdminPage from './pages/AdminPage';
import { Route, Routes } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';
import AuthorizationPage from './pages/AuthorizationPage';
import { checkIsAdmin, checkIsDayOff } from './store/adminSlise';
import { useAppDispatch } from './store/store';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkIsDayOff());
    dispatch(checkIsAdmin());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/sign-in" element={<AuthorizationPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/date" element={<DatePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
