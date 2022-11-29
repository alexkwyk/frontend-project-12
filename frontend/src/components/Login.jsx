import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useAuth } from '../contexts/index.js';
import loginImage from '../assets/loginImage.jpg';
import Header from './Header.jsx';

const Login = () => {
  const auth = useAuth();
  const [authError, setAuthError] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ username, password }) => {
      setSubmitDisabled(true);
      await auth.login({ username, password }, setAuthError);
      setSubmitDisabled(false);
    },
  });

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
                      src={loginImage}
                      alt=""
                      className="rounded-circle"
                    />
                  </div>
                </div>
                <Form
                  className="col-12 col-md-6 mb-5"
                  onSubmit={formik.handleSubmit}
                >
                  <h1 className="text-center mb-5">
                    {t('login.title')}
                  </h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      type="username"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      isInvalid={authError}
                      name="username"
                      placeholder={t('login.username')}
                      required
                    />
                    <Form.Label htmlFor="username">{t('login.username')}</Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      id="password"
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={authError}
                      name="password"
                      placeholder={t('login.password')}
                      required
                    />
                    <Form.Label htmlFor="password">{t('login.password')}</Form.Label>
                    {authError && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {t('errors.invalidLoginPassword')}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="outline-primary w-100"
                    disabled={submitDisabled}
                  >
                    {t('login.submit')}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="p-3">
                <div className="text-center">
                  {t('login.footerMessage')}
                  {' '}
                  <a href="/signup">{t('login.footerLink')}</a>
                </div>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
