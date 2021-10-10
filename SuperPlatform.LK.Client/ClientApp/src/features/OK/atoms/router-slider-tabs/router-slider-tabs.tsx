import React, { useEffect, useRef } from 'react';
import { useStore } from 'effector-react';

import { NavLink } from 'react-router-dom';
import { $OCardStore } from '../../model';

import s from './router-slider-tabs.module.scss';

export const RouterSlilderTabs: React.FC = () => {
  const { directions } = useStore($OCardStore);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      const activeElem = wrap.querySelector('a[aria-current="page"]');

      activeElem.scrollIntoView({ block: 'center', inline: 'end' });
    }
  }, []);

  if (!directions.data) {
    return null;
  }

  return (
    <div className={s.wrap} ref={wrapRef}>
      {directions.data.map(({ name, id }) => (
        <NavLink
          className={s.item}
          activeClassName={s.item_active}
          to={`/directions/${id}`}
          key={id}
        >
          {name}
        </NavLink>
      ))}
    </div>
  );
};
