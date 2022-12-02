import React from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { useDispatch } from 'react-redux';
import * as filter from 'leo-profanity';

import { NetworkApiContext } from './index.js';

import { setCurrentChannelId } from '../slices/channelsSlice.js';
import { closeModal } from '../slices/modalSlice.js';

const useProvideNetworkApi = (socket) => {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const dispatch = useDispatch();

  const addChannel = async (name, setSubmitDisabled) => {
    socket
      .timeout(5000)
      .emit('newChannel', { name }, (err, response) => {
        if (err) {
          toast.error(t('toast.networkError'));
          rollbar.error(err);
        } else if (response.status === 'ok') {
          dispatch(setCurrentChannelId(response.data.id));
          dispatch(closeModal());
          toast.success(t('toast.addChannel'));
        }
        setSubmitDisabled(false);
      });
  };

  const removeChannel = async (id, setSubmitDisabled) => {
    socket
      .timeout(5000)
      .emit('removeChannel', { id }, (err, response) => {
        if (err) {
          rollbar.error(err);
          toast.error(t('toast.networkError'));
        } else if (response.status === 'ok') {
          dispatch(closeModal());
          toast.success(t('toast.removeChannel'));
        }
        setSubmitDisabled(false);
      });
  };

  const renameChannel = async (id, name, setSubmitDisabled) => {
    socket
      .timeout(5000)
      .emit(
        'renameChannel',
        { id, name },
        (err, response) => {
          if (err) {
            rollbar.error(err);
            toast.error(t('toast.networkError'));
          } else if (response.status === 'ok') {
            dispatch(closeModal());
            toast.success(t('toast.renameChannel'));
          }
          setSubmitDisabled(false);
        },
      );
  };

  const sendMessage = async (message, username, channelId, handleReset, setSubmitDisabled) => {
    socket
      .timeout(5000)
      .emit(
        'newMessage',
        {
          body: filter.clean(message, '*'),
          username,
          channelId,
        },
        (err, response) => {
          if (err) {
            toast.error(t('toast.networkError'));
            rollbar.error(err);
          } else if (response.status === 'ok') {
            handleReset();
          }
          setSubmitDisabled(false);
        },
      );
  };

  return {
    addChannel, removeChannel, renameChannel, sendMessage,
  };
};

const NetworkApiProvider = ({ children, socket }) => {
  const api = useProvideNetworkApi(socket);
  return (
    <NetworkApiContext.Provider value={api}>
      {children}
    </NetworkApiContext.Provider>
  );
};

export default NetworkApiProvider;
