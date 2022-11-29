/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import fetchData from './fetchThunk.js';

const defaultChannelId = 1;

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({
    currentChannelId: defaultChannelId,
  }),
  reducers: {
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    addChannel: (state, { payload }) => {
      channelsAdapter.addOne(state, payload);
    },
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload);
      if (state.currentChannelId === payload) {
        state.currentChannelId = defaultChannelId;
      }
    },
    renameChannel: channelsAdapter.upsertOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        channelsAdapter.setAll(state, payload.channels);
        state.currentChannelId = payload.currentChannelId;
      });
  },
});

export const {
  setCurrentChannelId,
  addChannel,
  removeChannel,
  renameChannel,
} = channelsSlice.actions;

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const getCurrentChannelId = (state) => state.channels.currentChannelId;
export const getChannelNames = createSelector(
  selectors.selectEntities,
  (selectEntities) => Object.values(selectEntities).map(({ name }) => name),
);

export default channelsSlice.reducer;
