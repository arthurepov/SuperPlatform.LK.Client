import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useHistory } from 'react-router-dom';
import { ActionSheet } from '../../../../ui/molecules/ActionSheet';
import { Child, TextBlock } from '../../atoms';
import { $global } from '../../model';
import {
  AsyncWrap,
  BackwardButton,
  Button,
  MainTemplate,
  Typography,
} from '../../../../ui';
import s from './sign-page.module.scss';

export const SignPage: FC = () => {
  const { children, loading } = useStore($global);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isActionSheetOpened, setActionSheetOpen] = useState(false);
  const history = useHistory();
  const selectedChildData = children.find(({ id }) => id === selectedChild);

  useEffect(() => {
    if (children?.length > 1) {
      setActionSheetOpen(true);
    }

    if (children?.length > 0) {
      setSelectedChild(children[0]?.id);
    }
  }, [children]);

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
      <AsyncWrap state={{ loading }}>
        <>
          <div className={s.wrap}>
            <Typography variant="h4" className={s.subtitle} color="secondary">
              Ребенок
            </Typography>
            <Child
              onClick={openActionSheet}
              withArrow={children?.length > 1}
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
            {children?.length > 1 && (
              <ActionSheet
                title="Выберите ребенка"
                isOpened={isActionSheetOpened}
                onClose={closeActionSheet}
              >
                <>
                  {children?.map((child) => (
                    <Child
                      onClick={() => selectChild(child.id)}
                      bottomText="3 кружка"
                      key={child.id}
                      withArrow={false}
                      {...child}
                    />
                  ))}
                </>
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
