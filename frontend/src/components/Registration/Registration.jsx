import React,
{
  useEffect,
  useRef,
  useState,
} from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../contexts/index.js';
import registrationImage from '../../assets/registrationImage.jpg';
import Header from '../Header.jsx';

const Registration = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const usernameInput = useRef();

  const [authError, setAuthError] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    if (authError) {
      usernameInput.current.select();
    }
  }, [authError]);

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
      setSubmitDisabled(true);
      await auth.signup({ username, password }, setAuthError);
      setSubmitDisabled(false);
    },
  });

  const submitNotValid = (!!formik.errors.username
    || !!formik.errors.password
    || !!formik.errors.passwordConfirm);
  const submitEmpty = (!formik.values.username
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
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      name="username"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={authError
                        || (!!formik.errors.username && formik.touched.username)}
                      placeholder={t('registration.username')}
                      ref={usernameInput}
                      required
                    />
                    <Form.Label htmlFor="username">{t('registration.username')}</Form.Label>
                    {(authError
                      || (!!formik.errors.username && formik.touched.username)
                    )
                      && (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {authError
                            ? t('errors.userAlreadyExists')
                            : t(formik.errors.username)}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      id="password"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={authError
                        || (!!formik.errors.password && formik.touched.password)}
                      name="password"
                      placeholder={t('registration.password')}
                      required
                    />
                    <Form.Label htmlFor="password">{t('registration.password')}</Form.Label>
                    {(!!formik.errors.password && formik.touched.password) && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {t(formik.errors.password)}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      id="passwordConfirm"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.passwordConfirm}
                      isInvalid={authError
                        || (!!formik.errors.passwordConfirm && formik.touched.passwordConfirm)}
                      name="passwordConfirm"
                      placeholder={t('registration.passwordConfirm')}
                      required
                    />
                    <Form.Label htmlFor="passwordConfirm">{t('registration.passwordConfirm')}</Form.Label>
                    {(!!formik.errors.passwordConfirm && formik.touched.passwordConfirm) && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {t(formik.errors.passwordConfirm)}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100"
                    variant={submitDisabled || submitNotValid || submitEmpty ? 'outline-primary' : 'primary'}
                    disabled={submitDisabled}
                  >
                    {t('registration.submit')}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="p-3">
                <div className="text-center">
                  {t('registration.footerMessage')}
                  {' '}
                  <a href="/login">{t('registration.footerLink')}</a>
                </div>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
