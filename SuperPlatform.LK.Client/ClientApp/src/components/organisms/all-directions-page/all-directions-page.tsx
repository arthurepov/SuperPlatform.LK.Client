import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useDebounce } from 'use-debounce';
import { useHistory } from 'react-router';
import {
  AsyncWrap,
  Button,
  FormItem,
  Input,
  MainTemplate,
  ScheduleTimes,
  SearchBar,
  Select,
  Spinner,
} from '../../../ui';
import {
  $global,
  HOST_URL,
  PEREODICITY_TYPES,
  RECORD_TYPES,
  SECTION_GROUP_URL,
  setCity,
  SUGGESTIONS_URL,
} from '../../model';
import { SectionInfo, WrapList } from '../../molecules';
import { HeaderTabs, NoData } from '../../atoms';
import s from './all-directions-page.module.scss';
import { Modal, request, useModal, useViewport } from '../../../libs';
import { signOnSectionAsync } from '../../../utils';

export const AllDirectionsPage: FC = () => {
  const history = useHistory();
  const [text, setText] = useState('');
  const [query] = useDebounce(text, 500);
  const [activeGroupLoading, setActiveGroupLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const { directions, cities, activeCity, loading, children } =
    useStore($global);
  const [suggestions, setSuggestions] = useState<any>([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSigning, setSigning] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const { isActive, toggleModal } = useModal();
  const {
    viewport: { isWide },
  } = useViewport();

  const childrenOptions = children.map(({ fullName, id: childId }) => ({
    text: fullName,
    value: childId,
  }));

  const [selectedChild, setSelectedChild] = useState(
    childrenOptions?.[0]?.value
  );

  const onSearchBarChange = ({ target: { value } }): void => {
    setText(value);
  };

  const clearSearchBarQuery = (): void => {
    setText('');
  };

  const getSuggestions = async (): Promise<void> => {
    try {
      setSugLoading(true);
      const newSuggestions = await request<any>({
        url: `${HOST_URL}${SUGGESTIONS_URL}?query=${query}`,
      })();

      setSuggestions(newSuggestions);
    } catch ({ message }) {
      console.error(message);
      setError(message);
    } finally {
      setSugLoading(false);
    }
  };

  const onChildChange = ({ target: { value } }): void => {
    setSelectedChild(value);
  };

  const onSuccess = (): void => {
    toggleModal();
    history.push('/signed');
  };

  useEffect(() => {
    if (query?.length >= 3) {
      getSuggestions();
    }
  }, [query]);

  useEffect(() => {
    if (children.length > 0) {
      setSelectedChild(children?.[0].id);
    }
  }, [children]);

  const pushState = {
    title: 'Дополнительное образование',
    path: '/',
  };

  const onSectionSelect = (groupId: number | string): void => {
    toggleModal();
    setActiveGroupId(groupId);
  };

  const onSubmit = async (): Promise<void> =>
    signOnSectionAsync(
      selectedChild,
      activeGroupId,
      setSigning,
      setError,
      onSuccess
    );

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

  useEffect(() => {
    if (activeGroupId) {
      getSectionGroup(activeGroupId);
    }
  }, [activeGroupId]);

  return (
    <MainTemplate
      header={
        <>
          <h1 className={s.main_title}>Дополнительное образование</h1>
          <HeaderTabs />
        </>
      }
    >
      <div className={s.wrap}>
        <div className={s.search}>
          <SearchBar
            value={text}
            onChange={onSearchBarChange}
            placeholder="Поиск"
          />
        </div>
        {query.length < 1 && (
          <div className={s.city}>
            <Select
              options={cities?.map(({ id, name }) => ({
                value: id?.toString(),
                text: name,
              }))}
              value={activeCity ?? ''}
              onChange={({ target: { value } }) => setCity(Number(value))}
            />
          </div>
        )}
        {query?.length < 3 && (
          <AsyncWrap
            state={{
              loading,
            }}
          >
            <div className={s.list}>
              <WrapList
                array={directions}
                title="Направления"
                href="directions"
              />
            </div>
          </AsyncWrap>
        )}
        {query?.length >= 3 && suggestions && (
          <AsyncWrap
            state={{
              loading: sugLoading,
              error,
            }}
          >
            <div className={s.hobbies}>
              {suggestions?.map((suggestion) => (
                <SectionInfo
                  pushState={pushState}
                  key={suggestion.id}
                  {...suggestion}
                  onClick={onSectionSelect}
                />
              ))}
            </div>
          </AsyncWrap>
        )}
        {!suggestions.length && query.length >= 3 && !sugLoading && (
          <div className={s.nothing}>
            <NoData
              buttonText="Вернуться в каталог"
              onClick={clearSearchBarQuery}
            />
          </div>
        )}
      </div>
      {isWide && (
        <Modal
          title="Запись на занятия"
          isActive={isActive}
          toggleModal={toggleModal}
        >
          {activeGroupLoading ? (
            <Spinner />
          ) : (
            <div className={s.modal_wrap}>
              <FormItem label="Ребенок">
                <Select onChange={onChildChange} options={childrenOptions} />
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
                helperText={
                  activeGroup?.cost &&
                  `${activeGroup?.cost}₽/${
                    PEREODICITY_TYPES[activeGroup?.costDuration]
                  }`
                }
              >
                <Input
                  disabled
                  value={RECORD_TYPES[activeGroup?.recordType ?? 0]}
                />
              </FormItem>
              <FormItem label="Расписание">
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
                Записаться
              </Button>
            </div>
          )}
        </Modal>
      )}
    </MainTemplate>
  );
};
