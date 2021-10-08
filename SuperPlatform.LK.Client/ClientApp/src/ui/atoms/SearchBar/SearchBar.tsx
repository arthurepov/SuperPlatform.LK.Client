import React from 'react';

import cn from 'classnames';

import { ReactComponent as SearchIcon } from './search.svg';

import s from './SearchBar.module.scss';

interface ISearchBar {
    placeholder: string;
    onChange: (...args: any[]) => void;
    value?: string;
    onClick?: () => void;
    description?: any;
}

export const SearchBar: React.FC<ISearchBar> = ({ placeholder, onChange, onClick, description, value, }) => (
    <div className={s.wrap}>
        <div>
            <input onChange={onChange} value={value} type="text" required />
            <span>{placeholder}</span>
            <SearchIcon className={cn({ [s.disabled]: !onClick })} onClick={onClick} />
        </div>
        {description && description}
    </div>
);
