import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../Header.jsx';
import NotFoundImage from '../../assets/NotFoundImage.svg';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100 d-flex flex-column">
      <Header />
      <div className="text-center">
        <img src={NotFoundImage} alt="Страница не найдена" className="h-25" />
        <h1>404</h1>
        <h4 className="text-muted">
          {t('notFound.message')}
        </h4>
        <a href="/" className="btn btn-link">
          {t('notFound.link')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
