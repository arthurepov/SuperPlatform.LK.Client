import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import { Link, useLocation } from 'react-router-dom';
import {
  usePastLocationState,
  useRouter,
  formatStringToPhoneLink,
} from '../../../libs';
import {
  AsyncWrap,
  BackwardButton,
  Button,
  MainTemplate,
  Select,
} from '../../../ui';
import { ReactComponent as LocationIcon } from '../../../assets/images/location-icon.svg';

import { $global, AGES, getData, isValidAge, YMPhoneClick } from '../../model';
import { MetroStation, NoData } from '../../atoms';
import { OrganizationOrDiscipline } from '../../molecules';

import s from './organization-page.module.scss';

export const OrganizationPage: React.FC = () => {
  const { title, goBackFunc } = usePastLocationState();
  const location = useLocation();
  const { match } = useRouter();
  const { organizations, loading } = useStore($global);
  const { id } = match.params;
  const [age, setAge] = useState(0);

  const onAgeSelectChange = useCallback(({ target: { value } }) => {
    setAge(Number(value));
  }, []);

  const pushState = {
    title: 'Назад',
    path: location.pathname,
  };

  useEffect(() => {
    if (organizations.length < 1) return;

    getData();
  }, []);

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <div className={s.wrap}>
        {/* <AsyncWrap */}
        {/*  state={{ */}
        {/*    loading, */}
        {/*  }} */}
        {/* > */}
        {/*  <> */}
        {/*    <div className={s.organization}> */}
        {/*      <div className={s.title}>{'safsfasf'}</div> */}
        {/*      {currentOrganization?.phone && ( */}
        {/*        <div className={s.contacts}> */}
        {/*          <div> */}
        {/*            <span>Телефон:</span> */}
        {/*            <a */}
        {/*              href={`tel:${formatStringToPhoneLink( */}
        {/*                currentOrganization?.phone */}
        {/*              )}`} */}
        {/*              onClick={() => */}
        {/*                YMPhoneClick({ */}
        {/*                  phone_number: currentOrganization?.phone, */}
        {/*                  discipline: '', */}
        {/*                  city: 'Альметьевск', */}
        {/*                  company_name: currentOrganization?.name, */}
        {/*                }) */}
        {/*              } */}
        {/*            > */}
        {/*              {currentOrganization?.phone} */}
        {/*            </a> */}
        {/*          </div> */}
        {/*        </div> */}
        {/*      )} */}
        {/*      {currentOrganization?.address && ( */}
        {/*        <div className={s.address}> */}
        {/*          <span>{currentOrganization?.address}</span> */}
        {/*          <Link */}
        {/*            to={{ */}
        {/*              pathname: '/ocmap', */}
        {/*              search: `?${currentOrganization?.latitude}&${currentOrganization?.longitude}`, */}
        {/*              state: pushState, */}
        {/*            }} */}
        {/*          > */}
        {/*            <Button variant="link" icon={<LocationIcon />}> */}
        {/*              На карте */}
        {/*            </Button> */}
        {/*          </Link> */}
        {/*        </div> */}
        {/*      )} */}
        {/*      {currentOrganization?.station && ( */}
        {/*        <MetroStation>{currentOrganization?.station}</MetroStation> */}
        {/*      )} */}
        {/*      <a */}
        {/*        href={`tel:${formatStringToPhoneLink( */}
        {/*          currentOrganization?.phone */}
        {/*        )}`} */}
        {/*        onClick={() => */}
        {/*          YMPhoneClick({ */}
        {/*            phone_number: currentOrganization?.phone, */}
        {/*            discipline: '', */}
        {/*            city: 'Альметьевск', */}
        {/*            company_name: currentOrganization?.name, */}
        {/*          }) */}
        {/*        } */}
        {/*      > */}
        {/*        <Button style={{ marginTop: '1rem' }}> */}
        {/*          Позвонить в организацию */}
        {/*        </Button> */}
        {/*      </a> */}
        {/*    </div> */}
        {/*    <div className={s.age_select}> */}
        {/*      <Select */}
        {/*        options={AGES} */}
        {/*        defaultValue="0" */}
        {/*        onChange={onAgeSelectChange} */}
        {/*      /> */}
        {/*    </div> */}
        {/*    <div className={s.disciplines}> */}
        {/*      {filteredSchedules?.map((discipline) => ( */}
        {/*        <OrganizationOrDiscipline */}
        {/*          key={discipline.id} */}
        {/*          {...discipline} */}
        {/*          organizationPage */}
        {/*          phone={currentOrganization?.phone} */}
        {/*        /> */}
        {/*      ))} */}
        {/*      {filteredSchedules?.length < 1 && <NoData back />} */}
        {/*    </div> */}
        {/*  </> */}
        {/* </AsyncWrap> */}
      </div>
    </MainTemplate>
  );
};
