import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useHistory } from 'react-router-dom';
import { ActionSheet } from '../../../../ui/molecules/ActionSheet';
import { Child, TextBlock } from '../../atoms';
import { $OCardStore } from '../../model';
import {
  AsyncWrap,
  BackwardButton,
  Button,
  MainTemplate,
  Typography,
} from '../../../../ui';
import s from './sign-page.module.scss';

export const SignPage: FC = () => {
  const {
    children: { data: childrenArray, error },
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
  const closeActionSheet = (): void => setActionSheetOpen(false);

  const selectChild = (id: string): void => {
    setSelectedChild(id);
    closeActionSheet();
  };

  const goBackFunc = (): void =>
    history.action === 'POP' ? history.push('/') : history.goBack();

  return (
    <MainTemplate
      header={<BackwardButton onClick={goBackFunc} text="Запись на занятия" />}
    >
      <AsyncWrap state={{ loading, error }}>
        <>
          <div className={s.wrap}>
            <Typography variant="h4" className={s.subtitle} color="secondary">
              Ребенок
            </Typography>
            <Child
              onClick={openActionSheet}
              withArrow={childrenArray?.length > 1}
              {...selectedChildData}
              bottomText="3 кружка"
            />
            <Typography variant="h4" className={s.subtitle} color="secondary">
              Услуга
            </Typography>
            <TextBlock
              withDivider
              topText="Школа авиамоделирования Авиатор"
              bottomText="МБУК г. Казани Дом культуры в жилом массиве Вознесенское"
            />
            <TextBlock
              withDivider
              topText="Групповые занятия"
              bottomText="800 ₽/занятие"
            />
            <Typography variant="h4" className={s.subtitle} color="secondary">
              Расписание
            </Typography>
            <TextBlock
              withDivider
              topText="15:00 – 16:00"
              bottomText="Понедельник"
            />
            <TextBlock withDivider topText="15:00 – 16:00" bottomText="Среда" />
            <TextBlock
              withDivider
              topText="11:00 – 12:00"
              bottomText="Четверг"
            />
            {childrenArray?.length > 1 && (
              <ActionSheet
                title="Выберите ребенка"
                isOpened={isActionSheetOpened}
                onClose={closeActionSheet}
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
          <Button className={s.button} isWide>
            Записаться
          </Button>
        </>
      </AsyncWrap>
    </MainTemplate>
  );
};
