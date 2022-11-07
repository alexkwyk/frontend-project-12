import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import fetchData from '../slices/fetchThunk.js';
import Header from './Header.jsx';
import Channels from './Channels.jsx';
import MessageForm from './MessageForm.jsx';
import Messages from './Messages.jsx';

const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const { token } = JSON.parse(user);
    dispatch(fetchData(token));
  }, [dispatch]);

  return (
    <div className="h-100 d-flex flex-column">
      <Header />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 flex-md-row">
          <div className="col-4 col-md-2 bg-light border-end px-0">
            <Channels />
          </div>
          <div className="col d-flex flex-column bg-white px-0">
            <Messages />
            <MessageForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
