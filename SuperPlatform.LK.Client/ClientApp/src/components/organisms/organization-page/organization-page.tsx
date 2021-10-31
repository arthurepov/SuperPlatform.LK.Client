import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { Link, useLocation } from 'react-router-dom';
import {
  usePastLocationState,
  useRouter,
  formatStringToPhoneLink,
  request,
} from '../../../libs';
import {
  AsyncWrap,
  BackwardButton,
  Button,
  MainTemplate,
  Select,
} from '../../../ui';
import { ReactComponent as LocationIcon } from '../../../assets/images/location-icon.svg';

import {
  $global,
  AGES,
  getData,
  HOST_URL,
  IOrganization,
  isValidAge,
  ORGANIZATIONS_URL,
  YMPhoneClick,
} from '../../model';
import { MetroStation, NoData } from '../../atoms';
import s from './organization-page.module.scss';
import { SectionGroups } from '../../molecules';

export const OrganizationPage: React.FC = () => {
  const { activeCity, cities } = useStore($global);
  const { title, goBackFunc } = usePastLocationState();
  const location = useLocation();
  const { match } = useRouter();
  const { id } = match.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [age, setAge] = useState(0);
  const [data, setData] = useState<IOrganization>(null);

  const onAgeSelectChange = useCallback(({ target: { value } }) => {
    setAge(Number(value));
  }, []);

  const activeCityObj = cities?.find(({ id: cityId }) => activeCity === cityId);

  const pushState = {
    title: 'Назад',
    path: location.pathname,
  };

  useEffect(() => {
    const getOrganizationInfo = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await request<IOrganization>({
          url: `${HOST_URL}${ORGANIZATIONS_URL}/${id}`,
        })();

        setData(res);
      } catch ({ message }) {
        console.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    getOrganizationInfo();
  }, []);

  useEffect(() => {
    if (cities?.length < 1 || !activeCity) {
      getData();
    }
  }, [activeCity, cities]);

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <div className={s.wrap}>
        <AsyncWrap
          state={{
            loading,
            error,
          }}
        >
          <>
            <div className={s.organization}>
              <div className={s.title}>{data?.name}</div>
              {(data?.phone || data?.email) && (
                <div className={s.contacts}>
                  {data?.phone && (
                    <div>
                      <span>Телефон:</span>
                      <a
                        href={`tel:${formatStringToPhoneLink(data.phone)}`}
                        onClick={() =>
                          YMPhoneClick({
                            phone_number: data.phone,
                            discipline: '',
                            city: activeCityObj?.name ?? 'Альметьевск',
                            company_name: data?.name,
                          })
                        }
                      >
                        {data.phone}
                      </a>
                    </div>
                  )}
                  {data?.email && (
                    <div>
                      <span>Email:</span>
                      <a href={`mailto:${data.email}`}>{data.email}</a>
                    </div>
                  )}
                </div>
              )}
              {data?.address && (
                <div className={s.address}>
                  <span>{data.address}</span>
                  <Link
                    to={{
                      pathname: '/ocmap',
                      search: `?${data?.latitude}&${data?.longitude}`,
                      state: pushState,
                    }}
                  >
                    <Button variant="link" icon={<LocationIcon />}>
                      На карте
                    </Button>
                  </Link>
                </div>
              )}
              {data?.station && <MetroStation>{data.station}</MetroStation>}
              <a
                href={`tel:${formatStringToPhoneLink(data?.phone)}`}
                onClick={() =>
                  YMPhoneClick({
                    phone_number: data?.phone,
                    discipline: '',
                    city: activeCityObj?.name ?? 'Альметьевск',
                    company_name: data?.name,
                  })
                }
              >
                <Button style={{ marginTop: '1rem' }}>
                  Позвонить в организацию
                </Button>
              </a>
            </div>
            <div className={s.age_select}>
              <Select
                options={AGES}
                defaultValue="0"
                onChange={onAgeSelectChange}
              />
            </div>
            <div className={s.disciplines}>
              {data?.sections?.map((section) => (
                <SectionGroups key={section?.id} {...section} />
              ))}
              {data?.sections?.length < 1 && <NoData back />}
            </div>
          </>
        </AsyncWrap>
      </div>
    </MainTemplate>
  );
};
