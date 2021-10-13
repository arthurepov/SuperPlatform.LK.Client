import { useEffect, MutableRefObject, DependencyList } from 'react';

export enum Transition {
  Start = 'TRANSITION_START',
  End = 'TRANSITION_END',
  Cancel = 'TRANSITION_CANCEL',
}

export type TransitionInfo = {
  state: Transition;
};

export const useTransition = (
  handleTransition: (
    event: TransitionEvent,
    transitionInfo: TransitionInfo
  ) => void,
  deps: DependencyList = [],
  isEnabled: boolean,
  ref?: MutableRefObject<HTMLElement>
): void => {
  useEffect(() => {
    const element = ref ? ref.current : document.body;

    const handleTransitionEnd = (event: TransitionEvent): void => {
      if (event.target === element) {
        handleTransition(event, { state: Transition.End });
      }
    };

    const handleTransitionCancel = (event: TransitionEvent): void => {
      if (event.target === element) {
        handleTransition(event, { state: Transition.Cancel });
      }
    };

    if (isEnabled) {
      element.addEventListener('transitionend', handleTransitionEnd, {
        passive: false,
      });
      element.addEventListener('transitioncancel', handleTransitionCancel, {
        passive: false,
      });
    }

    return () => {
      element.removeEventListener('transitionend', handleTransitionEnd);
      element.removeEventListener('transitioncancel', handleTransitionCancel);
    };
  }, [isEnabled, ...deps]);
};
