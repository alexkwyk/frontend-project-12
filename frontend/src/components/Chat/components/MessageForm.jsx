/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useAuth, useNetworkApi } from '../../../contexts/index.js';
import { getCurrentChannelId } from '../../../slices/channelsSlice.js';

const MessageForm = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const input = useRef();
  const api = useNetworkApi();

  const { username } = auth.user;

  const currentChannelId = useSelector(getCurrentChannelId);

  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    input.current.focus();
  }, [currentChannelId]);

  const formik = useFormik({
    initialValues: {
      userMessage: '',
    },
    onSubmit: async (values) => {
      setSubmitDisabled(true);
      const handleReset = () => {
        formik.resetForm();
        input.current.focus();
      };
      await api.sendMessage(
        values.userMessage,
        username,
        currentChannelId,
        handleReset,
        setSubmitDisabled,
      );
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
            variant={submitDisabled || formik.values.userMessage.trim().length === 0 ? 'outline-primary' : 'primary'}
            disabled={submitDisabled || formik.values.userMessage.trim().length === 0}
          >
            {t('messages.send')}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;
