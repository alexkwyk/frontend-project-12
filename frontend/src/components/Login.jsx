import { useContext, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../contexts/index.js';
import loginImage from '../assets/loginImage.jpg';
import Header from './Header.jsx';

const loginSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const auth = useContext(AuthContext);
  const [errorOutput, setErrorOutput] = useState(null);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async ({ username, password }) => {
      auth.login({ username, password }, setErrorOutput);
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
                    Войти
                  </h1>
                  <div className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      type="username"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      isInvalid={!!errorOutput}
                      name="username"
                      placeholder="Никнейм"
                    />
                    <Form.Label>Никнейм</Form.Label>
                  </div>
                  <div className="form-floating mb-4">
                    <Form.Control
                      id="password"
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={!!errorOutput}
                      name="password"
                      placeholder="Пароль"
                    />
                    <Form.Label>Пароль</Form.Label>
                    {errorOutput && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errorOutput}
                      </Form.Control.Feedback>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="outline-primary w-100"
                  >
                    Войти
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="p-3">
                <div className="text-center">
                  Нет аккаунта?
                  {' '}
                  <a href="/signup">Регистрация</a>
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
