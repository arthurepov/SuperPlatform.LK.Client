import React from 'react';
import { useHistory } from 'react-router';
import { Button } from '../../../../ui';

import s from './no-data.module.scss';

interface INoData {
  error?: string;
  back?: boolean;
  buttonText?: string;
  onClick?: (...args: any[]) => any;
}

export const NoData: React.FC<INoData> = ({
  error,
  back,
  buttonText,
  onClick,
}) => {
  const history = useHistory();

  return (
    <div className={s.wrap}>
      <div>{error || 'Ничего не найдено'}</div>
      {back && (
        <Button onClick={() => history.goBack()}>Вернуться назад</Button>
      )}
      {buttonText && onClick && <Button onClick={onClick}>{buttonText}</Button>}
    </div>
  );
};
