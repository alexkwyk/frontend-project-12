/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice.js';
import fetchData from './fetchThunk.js';

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        messagesAdapter.setAll(state, payload.messages);
      })
      .addCase(removeChannel, (state, { payload }) => {
        const removeMessagesIds = Object.values(state.entities)
          .filter(({ channelId }) => payload === channelId)
          .map(({ id }) => id);
        messagesAdapter.removeMany(state, removeMessagesIds);
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);

export const getCurrentChannelMessages = createSelector(
  (state) => state.channels.currentChannelId,
  selectors.selectAll,
  (currentChannelId, selectAll) => selectAll
    .filter((item) => item.channelId === currentChannelId),
);

export default messagesSlice.reducer;
