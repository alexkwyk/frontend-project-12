import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getChannelNames } from '../../../../slices/channelsSlice.js';
import { useNetworkApi } from '../../../../contexts/index.js';

const Add = ({ handleClose }) => {
  const { t } = useTranslation();
  const api = useNetworkApi();

  const [sumbitDisabled, setSubmitDisabled] = useState(false);

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
    initialValues: { name: '' },
    validationSchema: channelSchema,
    onSubmit: async (values) => {
      setSubmitDisabled(true);
      await api.addChannel(values.name, setSubmitDisabled);
    },
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('modal.createChannel')}
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
              autoFocus
              autoComplete="false"
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

export default Add;
