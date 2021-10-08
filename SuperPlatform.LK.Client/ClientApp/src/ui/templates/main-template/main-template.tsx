import React from 'react';

import s from './main-template.module.scss';

interface MainTemplateProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({ header, children, footer }) => (
    <div className={s.main}>
        {header && <div className={s.header}>{header}</div>}
        {children}
        {footer && <div className={s.footer}>{footer}</div>}
    </div>
);
