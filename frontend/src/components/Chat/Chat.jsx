import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import fetchData from '../../slices/fetchThunk.js';
import Header from '../Header.jsx';
import Channels from './components/Channels.jsx';
import MessageForm from './components/MessageForm.jsx';
import Messages from './components/Messages.jsx';
import ModalWindow from './components/ModalWindow.jsx';
import { useAuth } from '../../contexts/index.js';

const Chat = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { t } = useTranslation();
  const { token } = auth.user;

  const [pageLoaded, setPageLoaded] = useState(false);

  const [tokenError, setTokenError] = useState(false);

  const handleSignOut = () => {
    auth.signout();
    setTokenError(false);
  };

  useEffect(() => {
    (async () => {
      const response = await dispatch(fetchData(token));
      if (response.error) {
        setTokenError(true);
      } else {
        setPageLoaded(true);
      }
    })();
  }, [dispatch, token]);

  return (
    <div className="h-100 d-flex flex-column">
      <Header />
      <ModalWindow />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        {pageLoaded ? (
          <div className="row h-100 flex-md-row">
            <div className="col-4 col-md-2 bg-light border-end px-0">
              <Channels />
            </div>
            <div className="col h-100 d-flex flex-column bg-white px-0 ">
              <Messages />
              <MessageForm />
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            {tokenError ? (
              <div className="text-center">
                <p>{t('errors.tokenErrorMessage1')}</p>
                <p>{t('errors.tokenErrorMessage2')}</p>
                <Button onClick={handleSignOut}>{t('errors.tokenErrorButton')}</Button>
              </div>
            ) : (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
