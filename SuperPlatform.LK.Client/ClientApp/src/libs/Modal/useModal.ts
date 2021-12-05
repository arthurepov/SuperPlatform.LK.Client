import { useState } from 'react';

export type TUseModal = {
  isActive: boolean;
  toggleModal: () => void;
};

export function useModal(initialState = false): TUseModal {
  const [isActive, setActive] = useState(initialState);

  const toggleModal = (): void => {
    setActive((prevState) => !prevState);
  };

  return { isActive, toggleModal };
}
