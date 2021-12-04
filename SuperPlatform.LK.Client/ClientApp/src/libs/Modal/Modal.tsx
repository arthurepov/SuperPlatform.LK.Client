import React, { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from '@material-ui/core';
import { Typography } from '../../ui';
import { useKeyPress, useLockBodyScroll, useOnClickOutside } from '../hooks';
import { ReactComponent as CloseCross } from '../../assets/images/close-cross.svg';
import s from './Modal.module.scss';

const renderTarget = document.getElementById('modal');

interface IModal {
  isActive: boolean;
  toggleModal: (...args: any[]) => void;
  title?: string;
  closeButton?: boolean;
}

export const Modal: FC<IModal> = ({
  isActive,
  title,
  closeButton = true,
  toggleModal,
  children,
}) => {
  const { ref } = useOnClickOutside(toggleModal);
  const { enableScroll, disableScroll } = useLockBodyScroll();
  const escapePressed = useKeyPress('Escape');

  useEffect(() => {
    if (escapePressed && isActive) {
      toggleModal();
    }
  }, [escapePressed, isActive]);

  useEffect(() => {
    if (isActive) {
      disableScroll();
    } else {
      enableScroll();
    }
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return createPortal(
    <div className={s.backdrop}>
      <div className={s.wrap} ref={ref}>
        {(title || closeButton) && (
          <div className={s.header}>
            {title && (
              <Typography className={s.title} variant="h2">
                {title}
              </Typography>
            )}
            {closeButton && (
              <Tooltip title="Закрыть">
                <div
                  className={s.close}
                  role="button"
                  tabIndex={0}
                  onClick={toggleModal}
                >
                  <CloseCross />
                </div>
              </Tooltip>
            )}
          </div>
        )}
        <div className={s.content}>{children}</div>
      </div>
    </div>,
    renderTarget as Element
  );
};
