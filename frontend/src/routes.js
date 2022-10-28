const apiPath = 'api/v1';

const routes = {
  loginPath: () => `${apiPath}/login`,
  signUpPath: () => `${apiPath}/signup`,
  dataPath: () => `${apiPath}/data`,
};

export default routes;
