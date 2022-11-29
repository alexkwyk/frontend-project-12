import React, { useState } from 'react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import routes from '../routes.js';
import { AuthContext } from './index.js';

const useProvideAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const currentUser = localStorage.getItem('user');
  const [user, setUser] = useState(currentUser ? JSON.parse(currentUser) : null);

  const login = async (userData, setAuthError) => {
    try {
      const response = await axios.post(routes.loginPath(), userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setAuthError(false);
      navigate('/', { from: location });
    } catch (e) {
      rollbar.error(e);
      if (e.response?.status === 401) {
        setAuthError(true);
        return;
      }
      toast.error(t('toast.networkError'));
    }
  };

  const signup = async (userData, setAuthError) => {
    try {
      const response = await axios.post(routes.signupPath(), userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setAuthError(false);
      navigate('/', { from: location });
    } catch (e) {
      rollbar.error(e);
      if (e.response?.status === 409) {
        setAuthError(true);
        return;
      }
      toast.error(t('toast.networkError'));
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login', { from: location });
  };

  return {
    user, login, signup, signout,
  };
};

const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
