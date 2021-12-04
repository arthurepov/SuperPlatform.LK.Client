import React, { FC } from 'react';
import cn from 'classnames';
import s from './child.module.scss';
import { IChild } from '../../model';
import { Avatar, Typography } from '../../../ui';
import { ReactComponent as Arrow } from './arrow.svg';
import { declensionOfNumber } from '../../../libs';

interface Props extends IChild {
  bottomText?: string;
  onClick?: () => void;
  withArrow?: boolean;
  size?: 'XS' | 'S' | 'M' | 'L';
}

const sectionDeclension = ['кружок', 'кружка', 'кружков'];

export const Child: FC<Props> = ({
  avatar,
  fullName,
  sections = [],
  bottomText,
  onClick,
  withArrow = !!onClick,
  size = 'S',
}) => {
  const description =
    bottomText ||
    `${sections.length} ${declensionOfNumber(
      sections.length,
      sectionDeclension
    )}`;

  return (
    <div role="button" tabIndex={0} className={s.root} onClick={onClick}>
      <Avatar variant={size} src={avatar} />
      <div className={cn(s.content, { [s.content_big]: size === 'L' })}>
        <Typography variant={size === 'L' ? 'h2' : 'body2'}>
          {fullName}
        </Typography>
        <Typography variant="h5" color="secondary">
          {description}
        </Typography>
      </div>
      {withArrow && size !== 'L' && <Arrow className={s.arrow} />}
    </div>
  );
};
