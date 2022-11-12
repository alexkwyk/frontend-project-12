import { useSelector, useDispatch } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { closeModal } from '../slices/modalSlice.js';
import { setCurrentChannelId } from '../slices/channelsSlice.js';

const AddingModal = ({ socket, handleClose }) => {
  const dispatch = useDispatch();
  const lastChannelId = useSelector((state) => state.channels.currentChannelId);
  const formik = useFormik({
    initialValues: { name: '' },
    onSubmit: (values) => {
      socket.emit('newChannel', { name: values.name }, (response) => {
        if (response.status === 'ok') {
          dispatch(setCurrentChannelId(lastChannelId + 1));
          handleClose();
        }
      });
    },
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Добавить задачу</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.name}
              name="name"
              type="name"
              autoFocus
            />
            <Button variant="secondary" onClick={handleClose}>
              Отменить
            </Button>
            <Button variant="primary" type="submit">
              Отправить
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};
const modalComponents = {
  adding: AddingModal,
};

const ModalWindow = ({ socket }) => {
  const dispatch = useDispatch();
  const { isOpened, type, target } = useSelector((state) => state.modal);
  const ModalComponent = modalComponents[type];
  const handleClose = () => dispatch(closeModal());
  return (
    <Modal show={isOpened} onHide={handleClose}>
      {isOpened && <ModalComponent socket={socket} target={target} handleClose={handleClose} />}
    </Modal>
  );
};

export default ModalWindow;
