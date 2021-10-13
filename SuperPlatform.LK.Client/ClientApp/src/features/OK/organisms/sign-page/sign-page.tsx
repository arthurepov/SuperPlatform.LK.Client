import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useHistory } from 'react-router-dom';
import s from './sign-page.module.scss';
import { ActionSheet } from '../../../../ui/molecules/ActionSheet';
import { Child } from '../../atoms';
import { $OCardStore } from '../../model';
import {
  AsyncWrap,
  BackwardButton,
  MainTemplate,
  Typography,
} from '../../../../ui';

export const SignPage: FC = () => {
  const {
    children: { data: childrenArray, error },
    directions,
    loading,
  } = useStore($OCardStore);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isActionSheetOpened, setActionSheetOpen] = useState(false);
  const history = useHistory();
  const selectedChildData = childrenArray.find(
    ({ id }) => id === selectedChild
  );

  useEffect(() => {
    if (childrenArray?.length > 1) {
      setActionSheetOpen(true);
    }

    if (childrenArray?.length > 0) {
      setSelectedChild(childrenArray[0]?.id);
    }
  }, [childrenArray]);

  const openActionSheet = (): void => setActionSheetOpen(true);

  const selectChild = (id: string): void => {
    setSelectedChild(id);
    setActionSheetOpen(false);
  };

  const goBackFunc = (): void =>
    history.action === 'POP' ? history.push('/') : history.goBack();

  return (
    <MainTemplate
      header={<BackwardButton onClick={goBackFunc} text="Запись на занятия" />}
    >
      <AsyncWrap state={{ loading, error }}>
        <div className={s.wrap}>
          <Typography variant="h5" className={s.subtitle} color="secondary">
            Ребенок
          </Typography>
          <Child onClick={openActionSheet} {...selectedChildData} />
          <Typography variant="h5" className={s.subtitle} color="secondary">
            Услуга
          </Typography>
          {childrenArray?.length > 1 && (
            <ActionSheet
              title="Выберите ребенка"
              isOpened={isActionSheetOpened}
            >
              {childrenArray?.map((child) => (
                <Child
                  onClick={() => selectChild(child.id)}
                  bottomText="3 кружка"
                  key={child.id}
                  withArrow={false}
                  {...child}
                />
              ))}
            </ActionSheet>
          )}
        </div>
      </AsyncWrap>
    </MainTemplate>
  );
};
