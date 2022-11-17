import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Remove = ({ socket, handleClose }) => {
  const { t } = useTranslation();
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
        <Modal.Title>{t('modal.deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modal.acceptMessage')}</p>
        <div className="mt-3 d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={handleClose}>
            {t('modal.cancelSubmit')}
          </Button>
          <Button variant="primary" type="button" onClick={handleRemove} disabled={submitDisabled}>
            {t('modal.deleteSubmit')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
