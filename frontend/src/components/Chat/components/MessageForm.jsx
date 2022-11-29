/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import * as filter from 'leo-profanity';
import { selectors as messagesSelectors } from '../../../slices/messagesSlice.js';
import { useAuth } from '../../../contexts/index.js';
import { getCurrentChannelId } from '../../../slices/channelsSlice.js';

const MessageForm = ({ socket }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const auth = useAuth();
  const input = useRef();

  const { username } = auth.user;

  const currentChannelId = useSelector(getCurrentChannelId);
  const messagesCount = useSelector(messagesSelectors.selectTotal);

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const formik = useFormik({
    initialValues: {
      userMessage: '',
    },
    onSubmit: (values) => {
      setSubmitDisabled(true);
      const message = {
        id: messagesCount + 1,
        body: filter.clean(values.userMessage, '*'),
        username,
        channelId: currentChannelId,
      };
      socket
        .timeout(5000)
        .emit('newMessage', message, (err, response) => {
          if (err) {
            toast.error(t('toast.networkError'));
            rollbar.error(err);
          } else if (response.status === 'ok') {
            formik.resetForm();
            input.current.focus();
          }
          setSubmitDisabled(false);
        });
    },
  });

  return (
    <div className="mt-auto">
      <Form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <InputGroup
          className="p-3"
        >
          <Form.Control
            name="userMessage"
            className="rounded-2"
            placeholder={t('messages.typeMessage')}
            aria-label={t('messages.newMessage')}
            aria-describedby="submit-btn"
            value={formik.values.userMessage}
            onChange={formik.handleChange}
            ref={input}
          />
          <Button
            type="submit"
            id="submit-btn"
            className="rounded-0 mx-1 p-2 h-100 rounded-2"
            variant={submitDisabled || formik.values.userMessage.length === 0 ? 'outline-primary' : 'primary'}
            disabled={submitDisabled || formik.values.userMessage.length === 0}
          >
            {t('messages.send')}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;
