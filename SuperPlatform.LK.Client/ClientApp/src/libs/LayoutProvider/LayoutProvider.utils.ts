import reduce from '../reduce';
import { Position, Bound, CreateLayout } from './LayoutProvider.typings';

export const createLayout: CreateLayout =
  (layoutReducer) => (layoutProps, items) =>
    reduce(
      (acc, item, index) => layoutReducer(acc, item, index, layoutProps),
      { height: 0, width: 0, top: 0, items: [] },
      items
    );

export const intersects = (a: Bound, b: Bound): boolean =>
  b.bottom > a.top && b.top < a.bottom;
export const transform = (position: Position, scale = 1): string =>
  `translate(${position.x}px, ${position.y}px) scale(${scale})`;
