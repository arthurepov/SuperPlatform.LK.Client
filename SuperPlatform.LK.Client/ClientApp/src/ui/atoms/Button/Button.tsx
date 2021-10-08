import React from 'react';

import cn from 'classnames';

import s from './Button.module.scss';

enum Size {
    XL = 'xl',
    L = 'l',
    M = 'm',
    S = 's',
}

enum Variant {
    Primary = 'primary',
    Outline = 'outline',
    Link = 'link',
    Ghost = 'ghost',
}

type ColorsType = 'xl' | 'l' | 'm' | 's';

type VariantType = 'primary' | 'outline' | 'link' | 'ghost';

interface ButtonProps {
    children: any;
    onClick?: (...args: any[]) => void;
    icon?: any;
    size?: ColorsType;
    variant?: VariantType;
    className?: string;
    [x: string]: any;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    onClick, 
    className,
    icon, 
    size = Size.L, 
    variant = Variant.Primary, 
    ...rest 
}) => {
    const buttonClassName = cn(s.button, {
        [s.extraLarge]: size === Size.XL,
        [s.large]: size === Size.L,
        [s.medium]: size === Size.M,
        [s.small]: size === Size.S,
        [s.primary]: variant === Variant.Primary,
        [s.outline]: variant === Variant.Outline,
        [s.link]: variant === Variant.Link,
        [s.ghost]: variant === Variant.Ghost,
        [className]: className
    });

    return (
        <button className={buttonClassName} onClick={onClick} tabIndex={0} {...rest}>
            <span tabIndex={-1}>{children}</span>
            {icon && icon}
        </button>
    );
};
