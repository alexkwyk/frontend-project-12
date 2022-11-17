/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';
import AuthContext from '../contexts/index.js';

const MessageForm = ({ socket }) => {
  const { t } = useTranslation();
  const { currentChannelId } = useSelector((state) => state.channels);
  const messagesCount = useSelector(messagesSelectors.selectTotal);

  const auth = useContext(AuthContext);
  const { username } = auth.user;

  const input = useRef();

  const formik = useFormik({
    initialValues: {
      userMessage: '',
    },
    onSubmit: (values) => {
      const message = {
        id: messagesCount + 1,
        body: values.userMessage,
        username,
        channelId: currentChannelId,
      };
      socket.emit('newMessage', message, (response) => {
        if (response.status === 'ok') {
          formik.resetForm();
          input.current.focus();
        }
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
            placeholder="Введите сообщение..."
            aria-describedby="submit-btn"
            value={formik.values.userMessage}
            onChange={formik.handleChange}
            ref={input}
          />
          <Button
            type="submit"
            id="submit-btn"
            className="rounded-0 mx-1 p-2 h-100 rounded-2"
            disabled={formik.values.userMessage.length === 0}
          >
            {t('messages.send')}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;
