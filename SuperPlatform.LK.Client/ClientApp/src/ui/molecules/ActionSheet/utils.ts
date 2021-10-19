const DEFAULT_OFFSET_FRACTION = 0.3;
const elastic = (position: number, fraction = 1): number =>
  Math.min(position * fraction, Math.max(position * fraction, position));

type GetDraggingTransformStyle = (props: {
  touchCurrent: number;
  touchStart: number;
  modalPosition: number;
  offsetFraction?: number;
}) => string;

export const getDraggingTransformStyle: GetDraggingTransformStyle = ({
  touchCurrent,
  touchStart,
  modalPosition,
  offsetFraction = DEFAULT_OFFSET_FRACTION,
}) => {
  const windowHeight = window.innerHeight;
  const positionOffset = touchCurrent - touchStart;
  const elasticOffset = elastic(positionOffset, offsetFraction);
  const translateY = Math.max(-windowHeight, elasticOffset - modalPosition);

  return `translateY(${translateY}px)`;
};
