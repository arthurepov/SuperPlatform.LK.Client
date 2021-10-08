import React, { memo } from 'react';

import s from './Select.module.scss';

interface ISelectOption {
    value: string;
    text: string;
}

interface ISelect {
    options: ISelectOption[];
    label?: string;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (...args: any[]) => void;
    disabled?: boolean;
}

export const Select: React.FC<ISelect> = memo(({
    defaultValue,
    value,
    onChange,
    label,
    options = [],
    disabled,
}) => (
    <div className={s.wrap}>
        <select
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            className={s.select}
            disabled={disabled}
        >
            {label && <option aria-label={label} value="">{label}</option>}
            {options.map(({ value: optionValue, text }) => (
                <option key={optionValue} value={optionValue}>{text}</option>
            ))}
        </select>
        <CaretIcon />
    </div>
));

const CaretIcon = () => (
    <div className={s.caretIcon}>
        <span />
        <span />
    </div>
);
