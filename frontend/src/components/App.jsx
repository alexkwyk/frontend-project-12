/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useContext, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import routes from '../routes.js';
import AuthContext from '../contexts/index.js';
import Chat from './Chat.jsx';
import Login from './Login.jsx';
import Registration from './Registration.jsx';
import NotFound from './NotFound.jsx';

const App = ({ socket }) => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route>
          <Route
            path="/"
            element={(
              <RequireAuth>
                <Chat socket={socket} />
              </RequireAuth>
            )}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/signup" element={<Registration />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

const AuthProvider = ({ children }) => {
  const currentUser = localStorage.getItem('user');
  const [user, setUser] = useState(currentUser ? JSON.parse(currentUser) : null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const rollbar = useRollbar();

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

  const value = {
    user, login, signup, signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  return useContext(AuthContext);
}

const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default App;
