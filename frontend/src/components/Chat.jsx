/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';
import fetchData from '../slices/fetchThunk.js';

const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const { token } = JSON.parse(user);
    dispatch(fetchData(token));
  }, []);

  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);
  return (
    <div>
      <div>{channels.map((item) => item.name)}</div>
      <div>{messages.map((item) => item.name)}</div>
    </div>
  );
};

export default Chat;
