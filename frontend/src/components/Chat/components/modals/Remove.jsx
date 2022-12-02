import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getModalTarget } from '../../../../slices/modalSlice.js';
import { useNetworkApi } from '../../../../contexts/index.js';

const Remove = ({ handleClose }) => {
  const { t } = useTranslation();
  const api = useNetworkApi();

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const { id } = useSelector(getModalTarget);

  const handleRemove = async () => {
    setSubmitDisabled(true);
    await api.removeChannel(id, setSubmitDisabled);
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
          <Button variant="danger" type="button" onClick={handleRemove} disabled={submitDisabled}>
            {t('modal.deleteSubmit')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
