import axios from 'axios';
import Cookies from 'js-cookie';

export const baseURL = 'https://server.umardjj.ru';

export const baseService = axios.create({
  baseURL,
});

export const logout = (): void => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  window.location.reload();
  window.location.replace('/');
};

export const accessToken = (accessToken: string) => {
  baseService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  Cookies.set('accessToken', accessToken);
};

export const refreshToken = (refreshToken: string) => {
  baseService.defaults.headers.common.Authorization = `Bearer ${refreshToken}`;
  Cookies.set('refreshToken', refreshToken);
};

export const accToken = Cookies.get('accessToken');

baseService.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);
