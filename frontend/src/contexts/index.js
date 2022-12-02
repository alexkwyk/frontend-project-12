/* eslint-disable import/prefer-default-export */
import { createContext, useContext } from 'react';

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

const NetworkApiContext = createContext({});
const useNetworkApi = () => useContext(NetworkApiContext);

export {
  AuthContext,
  useAuth,
  NetworkApiContext,
  useNetworkApi,
};
