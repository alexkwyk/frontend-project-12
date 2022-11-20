import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import fetchData from '../slices/fetchThunk.js';
import Header from './Header.jsx';
import Channels from './Channels.jsx';
import MessageForm from './MessageForm.jsx';
import Messages from './Messages.jsx';
import ModalWindow from './ModalWindow.jsx';
import AuthContext from '../contexts/index.js';

const Chat = ({ socket }) => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const { token } = auth.user;
  useEffect(() => {
    dispatch(fetchData(token));
  }, [dispatch, token]);

  return (
    <div className="h-100 d-flex flex-column">
      <Header />
      <ModalWindow socket={socket} />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 flex-md-row">
          <div className="col-4 col-md-2 bg-light border-end px-0">
            <Channels />
          </div>
          <div className="col h-100 d-flex flex-column bg-white px-0 ">
            <Messages />
            <MessageForm socket={socket} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
