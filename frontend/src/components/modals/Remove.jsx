import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

const Remove = ({ socket, handleClose }) => {
  const { id } = useSelector((state) => state.modal.target);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleRemove = () => {
    setSubmitDisabled(true);
    socket.emit('removeChannel', { id }, (response) => {
      if (response.status === 'ok') {
        setSubmitDisabled(false);
        handleClose();
      }
    });
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Подтверждение удаления.</p>
        <div className="mt-3 d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" type="button" onClick={handleRemove} disabled={submitDisabled}>
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
