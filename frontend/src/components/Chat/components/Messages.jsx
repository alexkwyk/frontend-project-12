import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getCurrentChannelId, selectors as channelsSelectors } from '../../../slices/channelsSlice.js';
import { getCurrentChannelMessages } from '../../../slices/messagesSlice.js';

const Messages = () => {
  const { t } = useTranslation();

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector(getCurrentChannelId);

  const messages = useSelector(getCurrentChannelMessages);
  const messagesCount = messages.length;

  return (
    <>
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
          {messagesCount}
          {' '}
          {t('messages.count', { count: messagesCount })}
        </span>
      </div>
      <div className="px-5 overflow-auto d-flex flex-column-reverse">
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
    </>
  );
};

export default Messages;
