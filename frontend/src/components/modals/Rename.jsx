import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { selectors } from '../../slices/channelsSlice.js';

const Rename = ({ socket, handleClose }) => {
  const input = useRef();
  const [sumbitDisabled, setSubmitDisabled] = useState(false);
  const channelName = useSelector((state) => state.modal.target.name);
  const channelId = useSelector((state) => state.modal.target.id);
  const channelNames = Object.values(useSelector(selectors.selectEntities))
    .map(({ name }) => name);

  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .max(13, 'Слишком длинное название')
      .required('Канал должен иметь название')
      .notOneOf(
        channelNames,
        'Такой канал уже существует',
      ),
  });

  const formik = useFormik({
    initialValues: { name: channelName },
    validationSchema: channelSchema,
    onSubmit: (values) => {
      setSubmitDisabled(true);
      socket.emit(
        'renameChannel',
        { id: channelId, name: values.name },
        (response) => {
          if (response.status === 'ok') {
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
        <Modal.Title>Переименовать канал</Modal.Title>
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
            <Form.Control.Feedback type="invalid">
              {(formik.errors.name)}
            </Form.Control.Feedback>
            <div className="mt-3 d-flex justify-content-end">
              <Button className="me-2" variant="secondary" onClick={handleClose}>
                Отменить
              </Button>
              <Button variant="primary" type="submit" disabled={!!formik.errors.name || sumbitDisabled}>
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
