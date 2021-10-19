/* eslint-disable no-magic-numbers */
import { useStore } from 'effector-react';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Map, Placemark, YMaps, ZoomControl } from 'react-yandex-maps';

import { AsyncWrap, BackwardButton, MainTemplate } from '../../../../ui';
import { $OCardStore, getAllFromOCard } from '../../model';

import s from './all-organizations-map-page.module.scss';

// eslint-disable-next-line no-magic-numbers
const ALMETEVSK_CENTER = [54.8889, 52.3247];

export const AllOrganizationsMapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { organizations, disciplines, loading } = useStore($OCardStore);
  const disciplinesArray =
    disciplines?.data?.filter(
      ({ direction }) => direction?.id === Number(id)
    ) ?? [];
  const organizationsIdsArray = [
    ...new Set(
      disciplinesArray.map(({ organizationsIds }) => organizationsIds).flat()
    ),
  ];
  const organizationsArray =
    organizations?.data?.filter(({ id: organizationsId }) =>
      organizationsIdsArray.includes(organizationsId)
    ) ??
    organizations.data ??
    [];

  useEffect(() => {
    if (organizations.data) return;

    getAllFromOCard();
  }, []);

  return (
    <MainTemplate
      header={<BackwardButton onClick={() => history.goBack()} text="Назад" />}
    >
      <AsyncWrap
        state={{
          loading,
          error: organizations.error,
        }}
      >
        <YMaps>
          <Map
            className={s.map}
            defaultState={{
              center: organizationsArray[0]?.latitude
                ? [
                    organizationsArray[0].latitude,
                    organizationsArray[0].longitude,
                  ]
                : ALMETEVSK_CENTER,
              zoom: 12,
              controls: [],
            }}
          >
            {organizationsArray.map(
              ({
                id: organizationId,
                latitude,
                longitude,
                name,
                address,
                phone,
              }) => (
                <Placemark
                  key={organizationId}
                  geometry={[latitude, longitude]}
                  properties={{
                    hintContent: name,
                    balloonContentBody: address,
                    balloonContentHeader: name,
                    balloonContentFooter: phone,
                  }}
                  modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                />
              )
            )}
            <ZoomControl
              options={{
                float: 'right',
              }}
            />
          </Map>
        </YMaps>
      </AsyncWrap>
    </MainTemplate>
  );
};
