import React, { FC, useEffect, useState } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { useStore } from 'effector-react';
import { toast } from 'react-toastify';
import {
  AsyncWrap,
  Avatar,
  BackwardButton,
  Button,
  FormItem,
  Input,
  MainTemplate,
  ScheduleTimes,
  Spinner,
  Typography,
} from '../../../ui';
import {
  $global,
  HOST_URL,
  PEREODICITY_TYPES,
  RECORD_TYPES,
  SECTION_GROUP_URL,
} from '../../model';
import { TextBlock } from '../../atoms';
import s from './child-page.module.scss';
import { Modal, request, useModal, useViewport } from '../../../libs';
import { signOutSectionAsync } from '../../../utils';

export const ChildPage: FC = () => {
  const {
    viewport: { isWide },
  } = useViewport();
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeGroupLoading, setActiveGroupLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const { isActive, toggleModal } = useModal();
  const { children, loading } = useStore($global);
  const { id } = useParams();
  const history = useHistory();
  const currentChild = children?.find(({ id: childId }) => childId === id);

  const goBackFunc = (): void =>
    history.action === 'POP' ? history.push('/') : history.goBack();

  const onChildClick = (groupId: number): void => {
    setActiveGroupId(groupId);
    toggleModal();
  };

  const getSectionGroup = async (groupId): Promise<void> => {
    try {
      setActiveGroupLoading(true);

      const data = await request({
        url: `${HOST_URL}${SECTION_GROUP_URL}/${groupId}`,
      })();

      setActiveGroup(data);
    } catch ({ message }) {
      console.error(message);
      toast.error(message);
    } finally {
      setActiveGroupLoading(false);
    }
  };

  useEffect(() => {
    if (activeGroupId) {
      getSectionGroup(activeGroupId);
    }
  }, [activeGroupId]);

  const onSuccess = (): void => {
    history.push('/signed');
  };

  const unsubscribe = async (): Promise<void> =>
    signOutSectionAsync(
      setUnsubscribing,
      currentChild?.id,
      activeGroupId,
      onSuccess
    );

  return (
    <MainTemplate
      header={
        <BackwardButton
          onClick={goBackFunc}
          text={currentChild?.fullName}
          extraElem={
            <Avatar
              className={s.avatar}
              variant="XS"
              src={currentChild?.avatar}
            />
          }
        />
      }
    >
      <AsyncWrap
        state={{
          loading,
        }}
      >
        <div className={s.wrap}>
          {currentChild?.sections?.map(
            ({
              sectionName,
              organizationName,
              sectionGroupName,
              sectionGroupId,
              directionName,
            }) =>
              !isWide ? (
                <Link
                  key={sectionGroupId}
                  to={`/signed/${id}/${sectionGroupId}`}
                >
                  <TextBlock
                    withDivider
                    withArrow
                    topText={sectionName}
                    bottomText={organizationName}
                    extraText={sectionGroupName}
                  />
                </Link>
              ) : (
                <div
                  key={sectionGroupId}
                  role="button"
                  tabIndex={0}
                  onClick={() => onChildClick(sectionGroupId)}
                >
                  <Avatar variant="L" />
                  <div>
                    <Typography variant="h6" uppercase bold>
                      {directionName}
                    </Typography>
                    <Typography variant="h2" color="link">
                      {sectionName}
                    </Typography>
                    <Typography bold color="secondary">
                      {organizationName}
                    </Typography>
                    <Typography className={s.group}>
                      {sectionGroupName}
                    </Typography>
                  </div>
                </div>
              )
          )}
        </div>
      </AsyncWrap>
      <Modal title="Подробнее" isActive={isActive} toggleModal={toggleModal}>
        {activeGroupLoading ? (
          <Spinner />
        ) : (
          <div className={s.modal_wrap}>
            <FormItem label="Ребенок">
              <Input disabled value={currentChild?.fullName} />
            </FormItem>
            <FormItem
              label="Дополнительное образование"
              helperText={activeGroup?.address}
            >
              <Input disabled value={activeGroup?.organizationName} />
            </FormItem>
            <FormItem label="Наименование услуги">
              <Input disabled value={activeGroup?.sectionName} />
            </FormItem>
            <FormItem
              label="Обучение"
              helperText={`${activeGroup?.cost}₽/${
                PEREODICITY_TYPES[activeGroup?.costDuration]
              }`}
            >
              <Input
                disabled
                value={RECORD_TYPES[activeGroup?.recordType ?? 0]}
              />
            </FormItem>
            <FormItem label="Расписание">
              <div>
                {activeGroup?.sectionGroupSchedules?.map(
                  ({ id: sheduleId, dayOfWeek, sectionGroupScheduleTimes }) => (
                    <ScheduleTimes
                      key={sheduleId}
                      dayOfWeek={dayOfWeek}
                      schedules={sectionGroupScheduleTimes}
                    />
                  )
                )}
              </div>
            </FormItem>
            <Button
              disabled={unsubscribing}
              onClick={unsubscribe}
              variant="warn"
              isWide
            >
              Отказаться от кружка
            </Button>
          </div>
        )}
      </Modal>
    </MainTemplate>
  );
};
