import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

const Remove = ({ socket, handleClose }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { id } = useSelector((state) => state.modal.target);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleRemove = () => {
    setSubmitDisabled(true);
    socket
      .timeout(5000)
      .emit('removeChannel', { id }, (err, response) => {
        if (err) {
          rollbar.error(err);
          toast.error(t('toast.networkError'));
          setSubmitDisabled(false);
        } else if (response.status === 'ok') {
          setSubmitDisabled(false);
          handleClose();
          toast.success(t('toast.removeChannel'));
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
