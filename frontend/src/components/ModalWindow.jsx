import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { closeModal } from '../slices/modalSlice.js';
import Add from './modals/Add.jsx';
import Remove from './modals/Remove.jsx';
import Rename from './modals/Rename.jsx';

const modalComponents = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const ModalWindow = ({ socket }) => {
  const dispatch = useDispatch();
  const { isOpened, type, target } = useSelector((state) => state.modal);
  const ModalComponent = modalComponents[type];
  const handleClose = () => dispatch(closeModal());
  return (
    <Modal
      show={isOpened}
      onHide={handleClose}
      centered
    >
      {isOpened && <ModalComponent socket={socket} target={target} handleClose={handleClose} />}
    </Modal>
  );
};

export default ModalWindow;
