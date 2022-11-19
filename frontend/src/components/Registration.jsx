import { useContext, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AuthContext from '../contexts/index.js';
import registrationImage from '../assets/registrationImage.jpg';
import Header from './Header.jsx';

const Registration = () => {
  const auth = useContext(AuthContext);
  const [authError, setAuthError] = useState(null);
  const { t } = useTranslation();

  const loginSchema = yup.object().shape({
    username: yup
      .string()
      .required('registration.required')
      .min(3, 'registration.usernameMinMax')
      .max(20, 'registration.usernameMinMax'),
    password: yup
      .string()
      .required('registration.required')
      .min(6, 'registration.passwordMin'),
    passwordConfirm: yup
      .string()
      .required('registration.required')
      .oneOf([yup.ref('password')], 'registration.passwordsNotMatch'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: loginSchema,
    onSubmit: async ({ username, password }) => {
      auth.signup({ username, password }, setAuthError);
    },
  });

  const submitDisabled = (!!formik.errors.name
    || !!formik.errors.password
    || !!formik.errors.passwordConfirm);
  const submitTouched = (!formik.values.username
    || !formik.values.password
    || !formik.values.passwordConfirm);

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
                    {t('registration.title')}
                  </h1>
                  <div className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      type="username"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={authError
                        || (!!formik.errors.username && formik.touched.username)}
                      name="username"
                      placeholder={t('registration.username')}
                    />
                    <Form.Label>{t('registration.username')}</Form.Label>
                    {(authError
                      || (!!formik.errors.username && formik.touched.username)
                    )
                      && (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {authError && t('errors.userAlreadyExists')}
                          {t(formik.errors.username)}
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
                      placeholder={t('registration.password')}
                    />
                    <Form.Label>{t('registration.password')}</Form.Label>
                    {(!!formik.errors.password && formik.touched.password) && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {t(formik.errors.password)}
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
                      placeholder={t('registration.passwordConfirm')}
                    />
                    <Form.Label>{t('registration.passwordConfirm')}</Form.Label>
                    {(!!formik.errors.passwordConfirm && formik.touched.passwordConfirm) && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {t(formik.errors.passwordConfirm)}
                      </Form.Control.Feedback>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-100"
                    variant={submitDisabled || submitTouched ? 'outline-primary' : 'primary'}
                  >
                    {t('registration.submit')}
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
