import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useParams, useHistory } from 'react-router';
import {
  AsyncWrap,
  BackwardButton,
  Button,
  MainTemplate,
  ScheduleTimes,
  SearchBar,
  Select,
  Spinner,
} from '../../../ui';
import {
  Modal,
  request,
  useModal,
  usePastLocationState,
  useViewport,
} from '../../../libs';
import {
  $global,
  arrayFilteringFunc,
  DIRECTIONS_URL,
  HOST_URL,
  ISection,
  PEREODICITY_TYPES,
  RECORD_TYPES,
  SECTION_GROUP_URL,
  setSections,
} from '../../model';
import { NoData, RouterSlilderTabs } from '../../atoms';
import { SectionInfo } from '../../molecules';
import { FormItem, Input } from '../../../ui';
import s from './DirectionPage.module.scss';
import { signOnSectionAsync } from '../../../utils';

export const DirectionPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [sectionLoading, setSectionLoading] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeGroupLoading, setActiveGroupLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [isSigning, setSigning] = useState(false);
  const { directions, activeCity, sections, disciplines, loading, children } =
    useStore($global);
  const childrenOptions = children.map(({ fullName, id: childId }) => ({
    text: fullName,
    value: childId,
  }));
  const [selectedChild, setSelectedChild] = useState(
    childrenOptions?.[0]?.value
  );
  const {
    viewport: { isWide },
  } = useViewport();
  const { isActive, toggleModal } = useModal();

  const getSectionGroup = async (groupId): Promise<void> => {
    try {
      setActiveGroupLoading(true);

      const data = await request({
        url: `${HOST_URL}${SECTION_GROUP_URL}/${groupId}`,
      })();

      setActiveGroup(data);
    } catch ({ message }) {
      console.error(message);
      setError(message);
    } finally {
      setActiveGroupLoading(false);
    }
  };

  const onSearchBarChange = ({ target: { value } }): void => {
    setQuery(value);
  };

  const clearSearchBarQuery = (): void => {
    setQuery('');
  };

  useEffect(() => {
    const getSection = async (): Promise<void> => {
      try {
        setSectionLoading(true);

        const res = await request<ISection[]>({
          url: `${HOST_URL}${DIRECTIONS_URL}/${id}/sections`,
        })();

        setSections({
          direction: Number(id),
          sections: res,
        });
      } catch ({ message }) {
        console.error(message);
        setError(message);
      } finally {
        setSectionLoading(false);
      }
    };

    if (!sections[id]) {
      getSection();
    }
  }, [disciplines, id, activeCity]);

  const currentDirection = directions?.find(
    ({ id: directionId }) => directionId === Number(id)
  );

  const pushState = {
    title: currentDirection?.name,
    path: `/directions/${id}`,
  };

  const { title, goBackFunc } = usePastLocationState({
    title: '??????????????????????',
    path: '/',
  });

  const fileredSections = arrayFilteringFunc(sections[id], query);

  const onSectionSelect = (groupId: number | string): void => {
    toggleModal();
    setActiveGroupId(groupId);
  };

  useEffect(() => {
    if (activeGroupId) {
      getSectionGroup(activeGroupId);
    }
  }, [activeGroupId]);

  const onSuccess = (): void => {
    toggleModal();
    history.push('/signed');
  };

  useEffect(() => {
    if (children.length > 0) {
      setSelectedChild(children?.[0].id);
    }
  }, [children]);

  const onChildChange = ({ target: { value } }): void => {
    setSelectedChild(value);
  };

  const onSubmit = async (): Promise<void> =>
    signOnSectionAsync(
      selectedChild,
      activeGroupId,
      setSigning,
      setError,
      onSuccess
    );

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <RouterSlilderTabs />
      <div className={s.search}>
        <SearchBar
          value={query}
          onChange={onSearchBarChange}
          placeholder="??????????"
        />
      </div>
      <AsyncWrap
        state={{
          loading: loading || sectionLoading,
          error,
        }}
      >
        <div className={s.wrap}>
          {fileredSections?.map((section) => (
            <SectionInfo
              pushState={pushState}
              key={section.id}
              {...section}
              onClick={onSectionSelect}
            />
          ))}
        </div>
      </AsyncWrap>
      {!fileredSections?.length && query.length > 0 && (
        <div className={s.nothing}>
          <NoData
            buttonText="?????????????????? ?? ??????????????"
            onClick={clearSearchBarQuery}
          />
        </div>
      )}
      {isWide && (
        <Modal
          title="???????????? ???? ??????????????"
          isActive={isActive}
          toggleModal={toggleModal}
        >
          {activeGroupLoading ? (
            <Spinner />
          ) : (
            <div className={s.modal_wrap}>
              <FormItem label="??????????????">
                <Select onChange={onChildChange} options={childrenOptions} />
              </FormItem>
              <FormItem
                label="???????????????????????????? ??????????????????????"
                helperText={activeGroup?.address}
              >
                <Input disabled value={activeGroup?.organizationName} />
              </FormItem>
              <FormItem label="???????????????????????? ????????????">
                <Input disabled value={activeGroup?.sectionName} />
              </FormItem>
              <FormItem
                label="????????????????"
                helperText={
                  activeGroup?.cost &&
                  `${activeGroup?.cost}???/${
                    PEREODICITY_TYPES[activeGroup?.costDuration]
                  }`
                }
              >
                <Input
                  disabled
                  value={RECORD_TYPES[activeGroup?.recordType ?? 0]}
                />
              </FormItem>
              <FormItem label="????????????????????">
                <div>
                  {activeGroup?.sectionGroupSchedules?.map(
                    ({
                      id: sheduleId,
                      dayOfWeek,
                      sectionGroupScheduleTimes,
                    }) => (
                      <ScheduleTimes
                        key={sheduleId}
                        dayOfWeek={dayOfWeek}
                        schedules={sectionGroupScheduleTimes}
                      />
                    )
                  )}
                </div>
              </FormItem>
              <Button disabled={isSigning} isWide onClick={onSubmit}>
                ????????????????????
              </Button>
            </div>
          )}
        </Modal>
      )}
    </MainTemplate>
  );
};
