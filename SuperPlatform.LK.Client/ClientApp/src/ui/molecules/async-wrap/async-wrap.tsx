import React from 'react';
import { Spinner } from '../../atoms';

import s from './async-wrap.module.scss';

interface IState {
  loading: boolean;
  error?: string;
}

interface IErrorProps {
  error: string;
}

interface IAsyncWrap {
  state: IState;
  renderError?: React.FC<any>;
  renderLoading?: React.FC<any>;
  children: React.ReactElement<any, any>;
}

const DefaultErrorComponent: React.FC<IErrorProps> = ({ error }) => (
  <div className={s.error}>
    <div className={s.error_title}>Ошибка!</div>
    <div className={s.error_text}>{error}</div>
  </div>
);

const DefaultLoadingComponent: React.FC = () => (
  <div className={s.loader}>
    <Spinner />
  </div>
);

export const AsyncWrap: React.FC<IAsyncWrap> = ({
  state,
  renderError: ErrorComponent = DefaultErrorComponent,
  renderLoading: LoadingComponent = DefaultLoadingComponent,
  children,
}) => {
  if (state.loading) {
    return <LoadingComponent />;
  }

  if (state.error?.length > 0) {
    return <ErrorComponent error={state.error} />;
  }

  return children;
};
