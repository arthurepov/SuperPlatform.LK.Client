import React from 'react';

import s from './Spinner.module.scss';

export const Spinner = () => (
    <div className={s.wrap}>
        <div className={s.spinner}>
            <div>
                <div />
            </div>
        </div>
    </div>
);
