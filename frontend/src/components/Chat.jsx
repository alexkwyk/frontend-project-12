/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Nav,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import { selectors as channelsSelectors, setCurrentChannelId } from '../slices/channelsSlice.js';
import { selectors as messagesSelectors, addMessage } from '../slices/messagesSlice.js';
import fetchData from '../slices/fetchThunk.js';
import Header from './Header.jsx';

const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const { token } = JSON.parse(user);
    dispatch(fetchData(token));
  }, []);

  const changeChannel = (id) => () => dispatch(setCurrentChannelId(id));

  const channels = useSelector(channelsSelectors.selectAll);

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const messages = useSelector(messagesSelectors.selectAll)
    .filter((item) => item.channelId === currentChannelId);

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
    <div className="h-100 d-flex flex-column">
      <Header />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 flex-md-row">
          <div className="col-4 col-md-2 bg-light border-end px-0">
            <Nav
              variant="pills"
              defaultActiveKey="1"
              className="flex-column"
            >
              <span className="py-4 px-3">Каналы</span>
              {channels.map((item) => (
                <Nav.Item as="li" key={item.id}>
                  <Button
                    type="button"
                    variant={item.id === currentChannelId ? 'primary' : ''}
                    className="border-0 w-100 rounded-0 text-start"
                    onClick={changeChannel(item.id)}
                  >
                    <span className="p-2">
                      #
                    </span>
                    {item.name}
                  </Button>
                </Nav.Item>
              ))}
            </Nav>
          </div>
          <div className="col d-flex flex-column bg-white px-0">
            <div className="bg-light mb-4 p-3 small shadow-sm">
              <p className="m-0">
                <b>
                  #
                  {' '}
                  {channels
                    .find((item) => item.id === currentChannelId)?.name}
                </b>
              </p>
              <span className="text-muted">
                {messages.length}
                {' '}
                сообщение
              </span>
            </div>
            <div className="px-5">
              {messages.map(({ username, body, id }) => (
                <p
                  key={id}
                  className="m-0"
                >
                  <b>{username}</b>
                  :
                  {' '}
                  {body}
                </p>
              ))}
            </div>
            <Form
              className="mt-auto"
              onSubmit={formik.handleSubmit}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
