import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { getChannelNames } from '../../../../slices/channelsSlice.js';
import { getModalTarget } from '../../../../slices/modalSlice.js';
import { useNetworkApi } from '../../../../contexts/index.js';

const Rename = ({ handleClose }) => {
  const { t } = useTranslation();
  const input = useRef();
  const api = useNetworkApi();

  const [sumbitDisabled, setSubmitDisabled] = useState(false);

  const { id, name: channelName } = useSelector(getModalTarget);
  const channelNames = useSelector(getChannelNames);

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
    onSubmit: async (values) => {
      setSubmitDisabled(true);
      await api.renameChannel(id, values.name, setSubmitDisabled);
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
          <Form.Group>
            <Form.Control
              isInvalid={!!formik.errors.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              id="name"
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
