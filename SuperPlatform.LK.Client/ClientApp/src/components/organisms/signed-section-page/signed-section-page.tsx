import React, { FC, useState } from 'react';
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
import { useFetch } from '../../../libs';
import s from './signed-section-page.module.scss';
import {
  ISectionGroup,
  PEREODICITY_TYPES,
  RECORD_TYPES,
  WEEK_DAYS_LONG,
} from '../../model';
import { signOutSectionAsync } from '../../../utils';

export const SignedSectionPage: FC = () => {
  const history = useHistory();
  const { childId, sectionGroupId } = useParams();
  const [unsubscribing, setUnsubscribing] = useState(false);
  const goBackFunc = (): void =>
    history.action === 'POP' ? history.push('/') : history.push('/signed');

  const { data, loading, error } = useFetch<ISectionGroup>({
    url: `/api/v1/SectionGroup/${sectionGroupId}`,
  });

  const onSuccess = (): void => {
    history.push('/signed');
  };

  const unsubscribe = async (): Promise<void> =>
    signOutSectionAsync(setUnsubscribing, childId, sectionGroupId, onSuccess);

  return (
    <MainTemplate
      header={
        <BackwardButton
          onClick={goBackFunc}
          text={history.action === 'POP' ? 'На главную' : 'Назад'}
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
            topText={data?.sectionName}
            bottomText={data?.address}
          />
          {data?.cost && (
            <TextBlock
              withDivider
              topText={RECORD_TYPES[data?.recordType ?? 0]}
              bottomText={`${data?.cost} ₽/${
                PEREODICITY_TYPES[data?.costDuration ?? 0]
              }`}
            />
          )}
          <Typography variant="h4" className={s.subtitle} color="secondary">
            Раписание
          </Typography>
          {data?.sectionGroupSchedules?.map(
            ({ id, dayOfWeek, sectionGroupScheduleTimes }) => (
              <TextBlock
                key={id}
                withDivider
                topText={sectionGroupScheduleTimes?.map(
                  ({ startTime, endTime }) => `${startTime} – ${endTime}`
                )}
                bottomText={WEEK_DAYS_LONG[dayOfWeek]}
              />
            )
          )}
          {data?.teacherFullName && (
            <>
              <Typography variant="h4" className={s.subtitle} color="secondary">
                Преподаватель
              </Typography>
              <Child
                id="1"
                avatar={data?.teacherPhoto}
                fullName={data?.teacherFullName}
                bottomText="Авиамоделирование"
              />
            </>
          )}
        </div>
      </AsyncWrap>
      <Button
        disabled={loading || error || unsubscribing}
        onClick={unsubscribe}
        className={s.button}
        variant="warn"
      >
        Отказаться от кружка
      </Button>
    </MainTemplate>
  );
};
