import './App.css';
import { useEffect } from 'react';
import DatePage from './pages/DatePage';
import FirstPage from './pages/FirstPage';
import AdminPage from './pages/AdminPage';
import { useAppDispatch } from './store/store';
import { Route, Routes } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';
import AuthorizationPage from './pages/AuthorizationPage';
import { checkIsAdmin, checkIsDayOff } from './store/adminSlise';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkIsDayOff());
    dispatch(checkIsAdmin());
  }, []);

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
