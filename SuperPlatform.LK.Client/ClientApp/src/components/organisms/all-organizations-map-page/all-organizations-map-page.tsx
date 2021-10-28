import { useStore } from 'effector-react';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Map, Placemark, YMaps, ZoomControl } from 'react-yandex-maps';
import { AsyncWrap, BackwardButton, MainTemplate } from '../../../ui';
import { $global, getData } from '../../model';
import s from './all-organizations-map-page.module.scss';

const ALMETEVSK_CENTER = [54.8889, 52.3247];

export const AllOrganizationsMapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { organizations, loading } = useStore($global);

  useEffect(() => {
    if (organizations) return;

    getData();
  }, []);

  return (
    <MainTemplate
      header={<BackwardButton onClick={() => history.goBack()} text="Назад" />}
    >
      <AsyncWrap
        state={{
          loading,
        }}
      >
        <YMaps>
          <Map
            className={s.map}
            defaultState={{
              center: organizations[0]?.latitude
                ? [organizations[0].latitude, organizations[0].longitude]
                : ALMETEVSK_CENTER,
              zoom: 12,
              controls: [],
            }}
          >
            {organizations.map(
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
