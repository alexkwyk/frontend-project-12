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
import routes from '../routes.js';
import AuthContext from '../contexts/index.js';
import Chat from './Chat.jsx';
import Login from './Login.jsx';
import NotFound from './NotFound.jsx';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route>
          <Route
            path="/"
            element={(
              <RequireAuth>
                <Chat />
              </RequireAuth>
            )}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

const AuthProvider = ({ children }) => {
  const currentUser = localStorage.getItem('user');
  const [user, setUser] = useState(currentUser ? JSON.parse(currentUser) : null);
  const navigate = useNavigate();
  const login = async (userData, setErrorOutput) => {
    try {
      const response = await axios.post(routes.loginPath(), userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setErrorOutput(null);
      navigate('/');
    } catch {
      setErrorOutput('Неверные имя пользователя или пароль');
    }
  };

  const signin = (newUser) => {
    setUser(newUser);
  };

  const signout = () => {
    setUser(null);
  };

  const value = {
    user, login, signin, signout,
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
