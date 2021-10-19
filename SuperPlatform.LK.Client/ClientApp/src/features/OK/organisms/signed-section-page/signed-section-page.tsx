import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  BackwardButton,
  Button,
  MainTemplate,
  Typography,
} from '../../../../ui';
import s from './signed-section-page.module.scss';
import { Child, TextBlock } from '../../atoms';

export const SignedSectionPage: FC = () => {
  const history = useHistory();
  const goBackFunc = (): void =>
    history.action === 'POP' ? history.push('/') : history.goBack();

  return (
    <MainTemplate
      header={
        <BackwardButton
          onClick={goBackFunc}
          text="МБУК г. Казани Дом культуры в жилом массиве Вознесенское"
        />
      }
    >
      <>
        <div className={s.wrap}>
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
            Раписание
          </Typography>
          <TextBlock
            withDivider
            topText="15:00 – 16:00"
            bottomText="Понедельник"
          />
          <TextBlock withDivider topText="15:00 – 16:00" bottomText="Среда" />
          <TextBlock withDivider topText="11:00 – 12:00" bottomText="Четверг" />
          <Typography variant="h4" className={s.subtitle} color="secondary">
            Преподаватель
          </Typography>
          <Child
            id="asfasf"
            fullName="Бурдюк Алексей Арнольдович"
            bottomText="Авиамоделирование"
          />
        </div>
      </>
      <Button className={s.button} variant="warn">
        Отказаться от кружка
      </Button>
    </MainTemplate>
  );
};
