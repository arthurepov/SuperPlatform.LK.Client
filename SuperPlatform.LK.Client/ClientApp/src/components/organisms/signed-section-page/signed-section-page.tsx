import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import {
  AsyncWrap,
  BackwardButton,
  Button,
  MainTemplate,
  Typography,
} from '../../../ui';
import { Child, TextBlock } from '../../atoms';
import { request, useFetch } from '../../../libs';
import s from './signed-section-page.module.scss';
import {
  getChildrenFx,
  ISectionGroup,
  PEREODICITY_TYPES,
  RECORD_TYPES,
  WEEK_DAYS_LONG,
} from '../../model';

const MOCK = [
  {
    id: 1,
    dayOfWeek: 1,
    sectionGroupScheduleTimes: [
      {
        id: 0,
        startTime: '10:00',
        endTime: '12:00',
      },
      {
        id: 1,
        startTime: '15:00',
        endTime: '17:00',
      },
    ],
  },
  {
    id: 2,
    dayOfWeek: 3,
    sectionGroupScheduleTimes: [
      {
        id: 0,
        startTime: '10:00',
        endTime: '12:00',
      },
    ],
  },
];

export const SignedSectionPage: FC = () => {
  const history = useHistory();
  const { childId, sectionGroupId } = useParams();
  const goBackFunc = (): void =>
    history.action === 'POP' ? history.push('/') : history.goBack();

  const { data, loading, error } = useFetch<ISectionGroup>({
    url: `/api/v1/SectionGroup/${sectionGroupId}`,
  });

  const unsubscribe = async (): Promise<void> => {
    try {
      return;
      await request({
        url: `/api/v1/Children/${childId}/sectionGroups/${sectionGroupId}`,
      });
      getChildrenFx();
      history.push('/signed');
    } catch ({ message }) {
      console.error(message);
    }
  };

  return (
    <MainTemplate
      header={
        <BackwardButton
          onClick={goBackFunc}
          text="МБУК г. Казани Дом культуры в жилом массиве Вознесенское"
        />
      }
    >
      <AsyncWrap
        state={{
          loading,
          error,
        }}
      >
        <div className={s.wrap}>
          <TextBlock
            withDivider
            topText="Школа авиамоделирования Авиатор"
            bottomText={data?.address}
          />
          <TextBlock
            withDivider
            topText={RECORD_TYPES[data?.recordType ?? 0]}
            bottomText={`${data?.cost ?? 0} ₽/${
              PEREODICITY_TYPES[data?.costDuration ?? 0]
            }`}
          />
          <Typography variant="h4" className={s.subtitle} color="secondary">
            Раписание
          </Typography>
          {MOCK.map(({ dayOfWeek, sectionGroupScheduleTimes }) => (
            <div key={dayOfWeek}>
              {sectionGroupScheduleTimes?.map(({ id, startTime, endTime }) => (
                <TextBlock
                  key={id}
                  withDivider
                  topText={`${startTime} – ${endTime}`}
                  bottomText={WEEK_DAYS_LONG[dayOfWeek]}
                />
              ))}
            </div>
          ))}
          <Typography variant="h4" className={s.subtitle} color="secondary">
            Преподаватель
          </Typography>
          <Child
            id="1"
            avatar={data?.teacherPhoto}
            fullName={data?.teacherFullName}
            bottomText="Авиамоделирование"
          />
        </div>
      </AsyncWrap>
      <Button
        disabled={loading || error}
        onClick={unsubscribe}
        className={s.button}
        variant="warn"
      >
        Отказаться от кружка
      </Button>
    </MainTemplate>
  );
};
