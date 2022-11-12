/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isOpened: false,
    type: null,
    target: null,
  },
  reducers: {
    openModal: ((state, { payload }) => {
      state.isOpened = true;
      state.type = payload.type;
      state.target = payload.target ?? null;
    }),
    closeModal: ((state) => {
      state.isOpened = false;
      state.type = null;
      state.target = null;
    }),
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
