/* eslint-disable import/prefer-default-export */
import { createContext, useContext } from 'react';

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthContext, useAuth };
