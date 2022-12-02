import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import resources from './locales/index.js';
import store from './slices/index.js';
import { addMessage } from './slices/messagesSlice.js';
import {
  addChannel,
  removeChannel,
  renameChannel,
} from './slices/channelsSlice.js';

import App from './components/App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NetworkApiProvider from './contexts/NetworkApiProvider.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';

const i18n = i18next.createInstance();
i18n.use(initReactI18next).init({
  fallbackLng: 'ru',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  resources,
});

const socket = io();
socket.on('newMessage', (payload) => {
  store.dispatch(addMessage(payload));
});
socket.on('newChannel', (payload) => {
  store.dispatch(addChannel(payload));
});
socket.on('removeChannel', (payload) => {
  store.dispatch(removeChannel(payload.id));
});
socket.on('renameChannel', (payload) => {
  store.dispatch(renameChannel(payload));
});

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
  environment: 'production',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <NetworkApiProvider socket={socket}>
            <BrowserRouter>
              <AuthProvider>
                <App />
                <ToastContainer />
              </AuthProvider>
            </BrowserRouter>
          </NetworkApiProvider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  </Provider>,
);
