import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { Child, TextBlock } from '../../atoms';
import {
  $global,
  HOST_URL,
  PEREODICITY_TYPES,
  RECORD_TYPES,
  SECTION_GROUP_URL,
  WEEK_DAYS_LONG,
} from '../../model';
import {
  AsyncWrap,
  BackwardButton,
  Button,
  MainTemplate,
  Typography,
  ActionSheet,
} from '../../../ui';
import { request } from '../../../libs';
import s from './sign-page.module.scss';
import { signOnSectionAsync } from '../../../utils';

export const SignPage: FC = () => {
  const { sectionGroupId } = useParams<{ sectionGroupId: string }>();
  const { children, loading } = useStore($global);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isActionSheetOpened, setActionSheetOpen] = useState(false);
  const history = useHistory();
  const selectedChildData = children.find(
    ({ id: childId }) => childId === selectedChild
  );
  const [groupLoading, setGroupLoading] = useState(true);
  const [error, setError] = useState('');
  const [group, setGroup] = useState(null);
  const [isSigning, setSigning] = useState(false);

  useEffect(() => {
    if (loading || groupLoading) {
      return;
    }

    if (children?.length > 1) {
      setActionSheetOpen(true);
    }

    if (children?.length > 0) {
      setSelectedChild(children[0]?.id);
    }
  }, [children, loading, groupLoading]);

  useEffect(() => {
    const getSectionGroup = async (): Promise<void> => {
      try {
        setGroupLoading(true);

        const data = await request({
          url: `${HOST_URL}${SECTION_GROUP_URL}/${sectionGroupId}`,
        })();

        setGroup(data);
      } catch ({ message }) {
        console.error(message);
        setError(message);
      } finally {
        setGroupLoading(false);
      }
    };

    getSectionGroup();
  }, []);

  const openActionSheet = (): void => {
    if (isSigning) {
      return;
    }

    setActionSheetOpen(true);
  };
  const closeActionSheet = (): void => setActionSheetOpen(false);

  const selectChild = (childId: string): void => {
    setSelectedChild(childId);
    closeActionSheet();
  };

  const goBackFunc = (): void =>
    history.action === 'POP' ? history.push('/') : history.goBack();

  const onSuccess = (): void => {
    history.push(`/signed/${selectedChild}/${sectionGroupId}`);
  };

  const onSubmit = async (): Promise<void> => {
    signOnSectionAsync(
      selectedChild,
      Number(sectionGroupId),
      setSigning,
      setError,
      onSuccess
    );
  };

  return (
    <MainTemplate
      header={<BackwardButton onClick={goBackFunc} text="???????????? ???? ??????????????" />}
    >
      <AsyncWrap state={{ loading: loading || groupLoading }}>
        <>
          <div className={s.wrap}>
            <Typography variant="h4" className={s.subtitle} color="secondary">
              ??????????????
            </Typography>
            <Child
              onClick={openActionSheet}
              withArrow={children?.length > 1}
              {...selectedChildData}
            />
            <Typography variant="h4" className={s.subtitle} color="secondary">
              ????????????
            </Typography>
            <TextBlock
              withDivider
              topText={group?.sectionName}
              bottomText={group?.organizationName}
            />
            {group?.cost && (
              <TextBlock
                withDivider
                topText={RECORD_TYPES[group?.recordType ?? 0]}
                bottomText={`${group?.cost} ???/${
                  PEREODICITY_TYPES[group?.costDuration ?? 0]
                }`}
              />
            )}
            <Typography variant="h4" className={s.subtitle} color="secondary">
              ????????????????????
            </Typography>
            {group?.sectionGroupSchedules?.map(
              ({ id, dayOfWeek, sectionGroupScheduleTimes }) => (
                <TextBlock
                  key={id}
                  withDivider
                  topText={sectionGroupScheduleTimes?.map(
                    ({ startTime, endTime }) => `${startTime} ??? ${endTime}`
                  )}
                  bottomText={WEEK_DAYS_LONG[dayOfWeek]}
                />
              )
            )}
            {children?.length > 1 && (
              <ActionSheet
                title="???????????????? ??????????????"
                isOpened={isActionSheetOpened}
                onClose={closeActionSheet}
              >
                <>
                  {children?.map((child) => (
                    <Child
                      onClick={() => selectChild(child.id)}
                      key={child.id}
                      withArrow={false}
                      {...child}
                    />
                  ))}
                </>
              </ActionSheet>
            )}
          </div>
          <Button
            disabled={isSigning || !group}
            onClick={onSubmit}
            className={s.button}
            isWide
          >
            ????????????????????
          </Button>
        </>
      </AsyncWrap>
    </MainTemplate>
  );
};
