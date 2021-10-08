import React from 'react';

import s from './title.module.scss';

interface ITitle {
    children: string;
}

export const Title: React.FC<ITitle> = ({ children }) => (
    <div className={s.item}>
        {children}
    </div>
);
