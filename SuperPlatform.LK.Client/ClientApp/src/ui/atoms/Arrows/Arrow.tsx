import React from 'react';

import cn from 'classnames';

import { ReactComponent as ArrowLeftSvg } from './arrow-left.svg';
import { ReactComponent as ArrowRightSvg } from './arrow-right.svg';

import s from './Arrow.module.scss';

interface ArrowProps {
    onClick?: () => void;
    className?: string;
}

export const ArrowLeft: React.FC<ArrowProps> = ({ onClick, className }) => (
    <div className={cn(s.arrow, s.arrow_left, className ?? '')} onClick={onClick}>
        <ArrowLeftSvg />
    </div>
);

export const ArrowRight: React.FC<ArrowProps> = ({ onClick, className }) => (
    <div className={cn(s.arrow, s.arrow_right, className ?? '')} onClick={onClick}>
        <ArrowRightSvg />
    </div>
);
