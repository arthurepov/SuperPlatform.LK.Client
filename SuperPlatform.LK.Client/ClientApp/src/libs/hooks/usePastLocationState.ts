import { useHistory } from 'react-router';
import { ILocationState } from '../types';

interface IDefaultPastLocation {
  title: string;
  path: string;
}
interface IUsePastLocationState {
  title: string;
  goBackFunc: () => void;
}

export const usePastLocationState = (
  defaultPastLocation?: IDefaultPastLocation
): IUsePastLocationState => {
  const history = useHistory();
  const pastLocation = history.location.state as ILocationState;
  const title =
    pastLocation?.title ?? defaultPastLocation?.title ?? 'На главную';
  const path = pastLocation?.path ?? defaultPastLocation?.path ?? '/';

  const goBackFunc = (): void => {
    history.push(path, title);
  };

  return { title, goBackFunc };
};
