import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import s from './header-tabs.module.scss';
import { useViewport } from '../../../libs';

export const HeaderTabs: FC = () => {
  const {
    viewport: { isWide },
  } = useViewport();

  return (
    <div
      className={cn(s.root, {
        [s.root_wide]: isWide,
      })}
    >
      <NavLink className={s.tab} exact activeClassName={s.tab_active} to="/">
        Все услуги
      </NavLink>
      <NavLink className={s.tab} activeClassName={s.tab_active} to="/signed">
        Уже ходим
      </NavLink>
    </div>
  );
};
