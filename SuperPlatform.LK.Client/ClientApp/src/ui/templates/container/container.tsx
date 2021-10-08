import React from 'react';

import s from './container.module.scss';

interface ContainerProps {
    children: any;
}

export const Container: React.FC<ContainerProps> = ({ children }) => <div className={s.container}>{children}</div>;
