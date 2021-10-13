import React, { FC, useCallback, ComponentProps, useEffect } from 'react';
import ActionSheetContext, { Visibility } from './ActionSheetContext';
import { Portal } from '../Portal';
import { useViewport, useDelayedRender } from '../../../libs';
import noop from '../../../libs/noop';

type ActionSheetProps = ComponentProps<typeof ActionSheetContext>;

export const ActionSheet: FC<ActionSheetProps> = ({
  title,
  footer,
  contentId,
  children,
  customShadow,
  pseudoBorder = null,
  initialHeight,
  showSwipeIcon,
  noFooterPadding,
  withBodyPaddingBottom,
  withOverlay,
  withSafePadding,
  withSwipeBackground,
  disableClosingBySwipe,
  disableOverlayPointerEvents,
  isOpened = false,
  isModalFullSize = false,
  isLocked = false,
  isScrollable,
  isWebview,
  dispatch,
  onClose = noop,
  onDragStart = noop,
  onDragEnd = noop,
  onVisibilityChange = noop,
  zIndex = 200,
}: ActionSheetProps) => {
  const [isVisible, setIsVisible] = useDelayedRender(isOpened, onClose);
  const { disableScroll, enableScroll } = useViewport();

  const handleChange = useCallback(
    (visibility: Visibility) => {
      onVisibilityChange(visibility);

      if (visibility === Visibility.Closed) {
        setIsVisible(false);
      }
    },
    [isOpened]
  );

  useEffect(() => {
    if (isOpened) {
      disableScroll();
    } else {
      enableScroll();
    }

    return enableScroll;
  }, [isOpened]);

  return (
    <Portal>
      {isVisible && (
        <ActionSheetContext
          title={title}
          footer={footer}
          contentId={contentId}
          isOpened={isOpened}
          isScrollable={isScrollable}
          isWebview={isWebview}
          withSwipeBackground={withSwipeBackground}
          disableClosingBySwipe={disableClosingBySwipe}
          disableOverlayPointerEvents={disableOverlayPointerEvents}
          onVisibilityChange={handleChange as any}
          withOverlay={withOverlay}
          initialHeight={initialHeight}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          dispatch={dispatch}
          noFooterPadding={noFooterPadding}
          showSwipeIcon={showSwipeIcon}
          customShadow={customShadow}
          withBodyPaddingBottom={withBodyPaddingBottom}
          pseudoBorder={pseudoBorder}
          isLocked={isLocked}
          isModalFullSize={isModalFullSize}
          withSafePadding={withSafePadding}
          zIndex={zIndex}
        >
          {children}
        </ActionSheetContext>
      )}
    </Portal>
  );
};
