import React, { forwardRef, ReactNode } from 'react';
import { ReactComponent as BackwardArrowSvg } from './backward-arrow.svg';
import s from './BackwardButton.module.scss';

type Ref = HTMLDivElement;
interface BackwardButtonProps {
  text: string;
  onClick: () => void;
  extraElem?: ReactNode;
}

export const BackwardButton = forwardRef<Ref, BackwardButtonProps>(
  ({ text, onClick, extraElem }, ref) => (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={s.button}
      title="Назад"
      onClick={onClick}
    >
      <BackwardArrowSvg />
      <div className={s.text}>{text}</div>
      {extraElem && extraElem}
    </div>
  )
);
