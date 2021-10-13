import { useEffect, DependencyList } from 'react';

export enum Orientation {
  Portrait = 'ORIENTATION_PORTRAIT',
  Landscape = 'ORIENTATION_LANDSCAPE',
}

export const useOrientationChange = (
  onOrientationChange: (
    event: DeviceOrientationEvent,
    orientation: Orientation
  ) => void,
  deps: DependencyList = [],
  isEnabled = true
): void => {
  useEffect(() => {
    const handleOrientationChange = (event: DeviceOrientationEvent): void => {
      const orientation =
        Math.abs(event.beta as number) === 90 && event.gamma === 0
          ? Orientation.Portrait
          : Orientation.Landscape;

      onOrientationChange(event, orientation);
    };

    if (isEnabled) {
      window.addEventListener('orientationchange', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isEnabled, ...deps]);
};
