import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import * as Yup from 'yup';
import { selectors } from '../../slices/channelsSlice.js';

const Rename = ({ socket, handleClose }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const input = useRef();
  const [sumbitDisabled, setSubmitDisabled] = useState(false);
  const channelName = useSelector((state) => state.modal.target.name);
  const channelId = useSelector((state) => state.modal.target.id);
  const channelNames = Object.values(useSelector(selectors.selectEntities))
    .map(({ name }) => name);

  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'modal.channelMinMax')
      .max(20, 'modal.channelMinMax')
      .required('modal.required')
      .notOneOf(
        channelNames,
        'modal.channelAlreadyExtists',
      ),
  });

  const formik = useFormik({
    initialValues: { name: channelName },
    validationSchema: channelSchema,
    onSubmit: (values) => {
      setSubmitDisabled(true);
      socket
        .timeout(5000)
        .emit(
          'renameChannel',
          { id: channelId, name: values.name },
          (err, response) => {
            if (err) {
              rollbar.error(err);
              toast.error(t('toast.networkError'));
              setSubmitDisabled(false);
            } else if (response.status === 'ok') {
              toast.success(t('toast.renameChannel'));
              setSubmitDisabled(false);
              handleClose();
            }
          },
        );
    },
    validateOnBlur: false,
  });

  useEffect(() => {
    input.current.select();
  }, [formik.touched.name]);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('modal.renameChannel')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              isInvalid={!!formik.errors.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
              type="name"
              autoFocus
              autoComplete="false"
              ref={input}
            />
            <Form.Label htmlFor="name" className="visually-hidden">
              {t('modal.hiddenLabel')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
            <div className="mt-3 d-flex justify-content-end">
              <Button className="me-2" variant="secondary" onClick={handleClose}>
                {t('modal.cancelSubmit')}
              </Button>
              <Button variant="primary" type="submit" disabled={!!formik.errors.name || sumbitDisabled}>
                {t('modal.sendSubmit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
