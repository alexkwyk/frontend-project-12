import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import fetchData from '../slices/fetchThunk.js';
import Header from './Header.jsx';
import Channels from './Channels.jsx';
import MessageForm from './MessageForm.jsx';
import Messages from './Messages.jsx';
import { addMessage } from '../slices/messagesSlice.js';
import AuthContext from '../contexts/index.js';

const Chat = () => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const { token } = auth.user;

  useEffect(() => {
    dispatch(fetchData(token));
  }, [dispatch, token]);

  const socket = io();
  socket.on('newMessage', (payload) => {
    dispatch(addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    console.log(payload); // { id: 6, name: "new channel", removable: true }
  });
  socket.on('removeChannel', (payload) => {
    console.log(payload); // { id: 6 };
  });
  socket.on('renameChannel', (payload) => {
    console.log(payload); // { id: 7, name: "new name channel", removable: true }
  });

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
            <MessageForm socket={socket} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
