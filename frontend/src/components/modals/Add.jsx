import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { selectors, setCurrentChannelId } from '../../slices/channelsSlice.js';

const Add = ({ socket, handleClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [sumbitDisabled, setSubmitDisabled] = useState(false);
  const lastChannelId = useSelector(
    (state) => state.channels.ids[state.channels.ids.length - 1],
  );
  const channelNames = Object.values(useSelector(selectors.selectEntities))
    .map(({ name }) => name);

  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .max(13, 'modal.channelMax')
      .required('modal.required')
      .notOneOf(
        channelNames,
        'modal.channelAlreadyExtists',
      ),
  });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: channelSchema,
    onSubmit: (values) => {
      setSubmitDisabled(true);
      socket.emit('newChannel', { name: values.name }, (response) => {
        if (response.status === 'ok') {
          dispatch(setCurrentChannelId(lastChannelId + 1));
          setSubmitDisabled(false);
          handleClose();
        }
      });
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
            />
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
