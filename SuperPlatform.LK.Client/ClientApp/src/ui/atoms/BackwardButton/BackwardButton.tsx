import React, { forwardRef } from 'react';

import { ReactComponent as BackwardArrowSvg } from './backward-arrow.svg';

import s from './BackwardButton.module.scss';

type Ref = HTMLDivElement;
interface BackwardButtonProps {
  text: string;
  onClick: () => void;
}

export const BackwardButton = forwardRef<Ref, BackwardButtonProps>(
  ({ text, onClick }, ref) => (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={s.button}
      title="Назад"
      onClick={onClick}
    >
      <BackwardArrowSvg />
      <div>{text}</div>
    </div>
  )
);
