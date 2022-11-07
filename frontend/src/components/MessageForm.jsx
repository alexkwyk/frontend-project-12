/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import { selectors as messagesSelectors, addMessage } from '../slices/messagesSlice.js';

const MessageForm = () => {
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const messagesCount = useSelector(messagesSelectors.selectTotal);

  const formik = useFormik({
    initialValues: {
      userMessage: '',
    },
    onSubmit: (values) => {
      const { username } = JSON.parse(localStorage.getItem('user'));
      const message = {
        id: messagesCount + 1,
        body: values.userMessage,
        username,
        channelId: currentChannelId,
      };
      dispatch(addMessage(message));
      formik.values.userMessage = '';
    },
  });

  return (
    <Form
      className="mt-auto"
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
        />
        <Button
          type="submit"
          id="submit-btn"
          className="rounded-0 mx-1 p-2 h-100 rounded-2"
          disabled={formik.values.userMessage.length === 0}
        >
          Отправить
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageForm;
