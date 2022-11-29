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

const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default App;
