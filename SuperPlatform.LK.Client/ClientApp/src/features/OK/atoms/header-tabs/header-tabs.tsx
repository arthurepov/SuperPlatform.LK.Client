import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import s from './header-tabs.module.scss';

export const HeaderTabs: FC = () => {
  return (
    <div className={s.root}>
      <NavLink className={s.tab} exact activeClassName={s.tab_active} to="/">
        Все услуги
      </NavLink>
      <NavLink className={s.tab} activeClassName={s.tab_active} to="/signed">
        Уже ходим
      </NavLink>
    </div>
  );
};
