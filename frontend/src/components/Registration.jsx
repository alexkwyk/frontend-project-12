import { useContext, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AuthContext from '../contexts/index.js';
import registrationImage from '../assets/registrationImage.jpg';
import Header from './Header.jsx';

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: yup
    .string()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  passwordConfirm: yup
    .string()
    .required('Обязательное поле')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
});

const Registration = () => {
  const auth = useContext(AuthContext);
  const [errorOutput, setErrorOutput] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: loginSchema,
    onSubmit: async ({ username, password }) => {
      auth.signup({ username, password }, setErrorOutput);
    },
    validateOnMount: true,
  });

  const submitDisabled = (!!formik.errors.name
    || !!formik.errors.password
    || !!formik.errors.passwordConfirm);

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-md-8 col-xxl-6">
            <Card>
              <Card.Body className="row p-5">
                <div className="col-12 col-md-5 d-flex justify-content-center align-items-center">
                  <div>
                    <img
                      src={registrationImage}
                      alt=""
                      className="rounded-circle"
                    />
                  </div>
                </div>
                <Form
                  className="col-12 col-md-6"
                  onSubmit={formik.handleSubmit}
                >
                  <h1 className="text-center mb-5">
                    Регистрация
                  </h1>
                  <div className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      type="username"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={!!errorOutput
                        || (!!formik.errors.username && formik.touched.username)}
                      name="username"
                      placeholder="Никнейм"
                    />
                    <Form.Label>Никнейм</Form.Label>
                    {(!!errorOutput
                      || (!!formik.errors.username && formik.touched.username)
                    )
                      && (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errorOutput}
                          {formik.errors.username}
                        </Form.Control.Feedback>
                      )}
                  </div>
                  <div className="form-floating mb-4">
                    <Form.Control
                      id="password"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={!!formik.errors.password && formik.touched.password}
                      name="password"
                      placeholder="Пароль"
                    />
                    <Form.Label>Пароль</Form.Label>
                    {(!!formik.errors.password && formik.touched.password) && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formik.errors.password}
                      </Form.Control.Feedback>
                    )}
                  </div>
                  <div className="form-floating mb-4">
                    <Form.Control
                      id="passwordConfirm"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.passwordConfirm}
                      isInvalid={!!formik.errors.passwordConfirm && formik.touched.passwordConfirm}
                      name="passwordConfirm"
                      placeholder="Подтвердите пароль"
                    />
                    <Form.Label>Подтвердите пароль</Form.Label>
                    {(!!formik.errors.passwordConfirm && formik.touched.passwordConfirm) && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formik.errors.passwordConfirm}
                      </Form.Control.Feedback>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-100"
                    variant={submitDisabled ? 'outline-primary' : 'primary'}
                    disabled={submitDisabled}
                  >
                    Войти
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
