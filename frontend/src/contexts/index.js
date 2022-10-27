import { createContext } from 'react';

const AuthContext = createContext({
  isAuthorized: false,
});

export default AuthContext;
