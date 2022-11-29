/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import { useAuth } from '../contexts/index.js';
import AuthProvider from '../contexts/AuthProvider.jsx';

import Chat from './Chat/Chat.jsx';
import Login from './Login/Login.jsx';
import Registration from './Registration/Registration.jsx';
import NotFound from './NotFound/NotFound.jsx';

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
          <Route
            path="/login"
            element={(
              <AlreadyAuth>
                <Login />
              </AlreadyAuth>
            )}
          />
          <Route
            path="/signup"
            element={(
              <AlreadyAuth>
                <Registration />
              </AlreadyAuth>
            )}
          />
          <Route
            path="/*"
            element={(
              <NotFound />
            )}
          />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

const AlreadyAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default App;
