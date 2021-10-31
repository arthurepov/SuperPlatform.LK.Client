import React, { FC } from 'react';
import s from './child.module.scss';
import { IChild } from '../../model';
import { Avatar, Typography } from '../../../ui';
import { ReactComponent as Arrow } from './arrow.svg';
import { declensionOfNumber } from '../../../libs';

interface Props extends IChild {
  bottomText?: string;
  onClick?: () => void;
  withArrow?: boolean;
}

const sectionDeclension = ['кружок', 'кружка', 'кружков'];

export const Child: FC<Props> = ({
  avatar,
  fullName,
  sections = [],
  bottomText,
  onClick,
  withArrow = !!onClick,
}) => {
  const description =
    bottomText ||
    `${sections.length} ${declensionOfNumber(
      sections.length,
      sectionDeclension
    )}`;

  return (
    <div role="button" tabIndex={0} className={s.root} onClick={onClick}>
      <Avatar variant="S" src={avatar} />
      <div className={s.content}>
        <Typography variant="body2">{fullName}</Typography>
        <Typography variant="h5" color="secondary">
          {description}
        </Typography>
      </div>
      {withArrow && <Arrow className={s.arrow} />}
    </div>
  );
};
