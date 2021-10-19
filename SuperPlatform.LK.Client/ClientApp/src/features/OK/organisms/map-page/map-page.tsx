import React from 'react';
import { Map, Placemark, YMaps, ZoomControl } from 'react-yandex-maps';

import { usePastLocationState, useRouter } from '../../../../libs';
import { BackwardButton, MainTemplate } from '../../../../ui';
import { NoData } from '../../atoms';

import s from './map-page.module.scss';

export const MapPage: React.FC = () => {
  const { title, goBackFunc } = usePastLocationState();
  const { location } = useRouter();
  const [latitude, longitude] = location.search
    ?.split('&')
    ?.map((el) => Number(el.replace('?', '')));

  if (!longitude || !latitude) {
    return (
      <MainTemplate>
        <div className={s.nothing}>
          <NoData back />
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <YMaps>
        <Map
          className={s.map}
          defaultState={{
            center: [latitude, longitude],
            zoom: 16,
            controls: [],
          }}
        >
          <Placemark geometry={[latitude, longitude]} />
          <ZoomControl
            options={{
              float: 'right',
            }}
          />
        </Map>
      </YMaps>
    </MainTemplate>
  );
};
