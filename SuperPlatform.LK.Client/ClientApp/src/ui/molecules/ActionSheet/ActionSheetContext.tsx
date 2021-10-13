// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow */
import React, {
  Dispatch,
  FC,
  memo,
  MutableRefObject,
  ReactChild,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames/bind';
import noop from '../../../libs/noop';
import { getDraggingTransformStyle } from './utils';
import {
  LayoutProvider,
  usePan,
  Pan,
  useTransition,
  Transition,
  useOrientationChange,
  Orientation,
  useResize,
} from '../../../libs';
import styles from './ActionSheet.module.scss';
import { ActionSheetAction, modalHeightChangeAction } from './reducers';

const cx: any = classNames.bind(styles);

const SLIDE_THRESHOLD = 20;
const MODAL_FULL_FRACTION = 0.95;
const MODAL_SHORT_FRACTION = 0.7;
const MODAL_HEADER_HEIGHT = 72;
const MODAL_NO_FOOTER_PADDING = 48;
const MODAL_NO_FOOTER_ZERO_PADDING = 0;
const EMPTY_OBJECT = {};
const FOOTER_MARGIN = 24;

type ActionSheetProps = {
  /** @property контент  */
  children: ReactChild | null;
  /** @property заголовок  */
  title?: ReactChild | null;
  /** @property футер  */
  footer?: ReactChild | null;
  /** @property стиль тени  */
  customShadow?: string;
  /** @deprecated  @property идентификатор контента модала (может быть смена панелей при открытом модале)  */
  contentId?: number;
  /** @property флаг открытия  */
  isOpened?: boolean;
  /** @deprecated @property флаг для вебвью  */
  isWebview?: boolean;
  /** @property  псевдо-бордер */
  pseudoBorder?: ReactNode;
  /** @property блокировка модала  */
  isLocked?: boolean;
  /** @property во весь экран  */
  isModalFullSize?: boolean;
  /** @property с паддингом  */
  withSafePadding?: boolean;

  /** @property отступ снизу  */
  withBodyPaddingBottom?: boolean;
  /** @property будет ли контент скроллиться  */
  isScrollable?: boolean;
  /** @property кастомная изначальная высота  */
  initialHeight?: number | null;
  /** @property показывать ли оверлей  */
  withOverlay?: boolean;
  /** @property показывать ли иконку свайпа  */
  showSwipeIcon?: boolean;
  /** @property добавлять ли отступ у футера  */
  noFooterPadding?: boolean;
  /** @property  */
  withSwipeBackground?: boolean;
  /** @property отключить прослушку событий у оверлея */
  disableOverlayPointerEvents?: boolean;
  /** @property отключает возможность сокрытия  */
  disableClosingBySwipe?: boolean;
  /** @property изменение состояия шторки  */
  onVisibilityChange?: (visibility?: Visibility) => void;
  /** @handler закрытие окна  */
  onClose?: Func<void>;
  /** @handler начало перемещения шторки  */
  onDragStart?: Func<void>;
  /** @handler завершения перемещения шторки  */
  onDragEnd?: Func<void>;
  dispatch?: Dispatch<ActionSheetAction>;
  /** @property СSS-свойство z-index  */
  zIndex?: number;
};

export enum Visibility {
  Full = 'VISIBILITY_FULL',
  Short = 'VISIBILITY_SHORT',
  Closed = 'VISIBILITY_CLOSED',
  Initial = 'VISIBILITY_INITIAL',
}

type PositionMap = Record<Visibility, number>;

const getModalMaxHeight = (
  contentRef: MutableRefObject<HTMLElement>
): number => {
  const windowHeight = window.innerHeight;
  const windowMaxHeight = windowHeight * MODAL_FULL_FRACTION;
  const content = contentRef.current;

  if (!content) {
    return 0;
  }

  const contentStyles = window.getComputedStyle(content);
  const contentOffsetTop = parseFloat(
    contentStyles.getPropertyValue('padding-top')
  );
  const contentOffsetBottom = parseFloat(
    contentStyles.getPropertyValue('padding-bottom')
  );
  const maxHeight = windowMaxHeight - (contentOffsetTop + contentOffsetBottom);

  return maxHeight;
};

const useDynamicPosition = (
  contentRef: MutableRefObject<HTMLElement>,
  bodyWrapperRef: MutableRefObject<HTMLElement>,
  bodyRef: MutableRefObject<HTMLElement>,
  scrollableWrapperRef: MutableRefObject<HTMLElement>,
  modalTitleRef: MutableRefObject<HTMLElement>,
  isOpened: boolean,
  isScrollable: boolean,
  children,
  hasFooter,
  forwardedInitialHeight,
  noFooterPadding?: boolean,
  dispatch?: Dispatch<ActionSheetAction>,
  isModalFullSize?: boolean,
  bodyPadding?
): [
  number,
  Visibility,
  Dispatch<SetStateAction<Visibility>>,
  boolean,
  boolean
] => {
  const hasScrollRef = useRef(false);
  const modalPositionRef = useRef<PositionMap>({
    [Visibility.Full]: 0,
    [Visibility.Short]: 0,
    [Visibility.Closed]: 0,
    [Visibility.Initial]: 0,
  });
  const [visibility, setVisibility] = useState(Visibility.Closed);
  const [orientation, setOrientation] = useState<Orientation>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const footerPadding = noFooterPadding
    ? MODAL_NO_FOOTER_ZERO_PADDING
    : MODAL_NO_FOOTER_PADDING;
  const bodyRefHeight = bodyRef.current && bodyRef.current.clientHeight;
  const modalTitle = modalTitleRef.current;
  const titleHeight = modalTitle
    ? modalTitle.getBoundingClientRect().height
    : MODAL_HEADER_HEIGHT;
  const hasVisibilityFull =
    modalPositionRef.current[Visibility.Full] !==
    modalPositionRef.current[Visibility.Short];

  useEffect(() => {
    if (forwardedInitialHeight !== null) {
      modalPositionRef.current[Visibility.Short] =
        forwardedInitialHeight + titleHeight + footerPadding;
    }
  }, [forwardedInitialHeight]);
  /*
        Определение изначальных положений модала
    */
  useEffect(() => {
    const initialHeight =
      bodyRef.current.clientHeight + titleHeight + footerPadding;
    const maxPosition = window.innerHeight * MODAL_FULL_FRACTION;

    modalPositionRef.current[Visibility.Full] = Math.round(initialHeight);

    if (forwardedInitialHeight === null) {
      modalPositionRef.current[Visibility.Short] = Math.min(
        Math.round(
          isScrollable
            ? Math.min(window.innerHeight * MODAL_SHORT_FRACTION, initialHeight)
            : initialHeight
        ),
        maxPosition
      );
    }
    /*
        нужно добавить в зависимости bodyPadding, чтобы учитывать все внутренние отступы для расчета Visibility.Short
         */
  }, [isOpened, forwardedInitialHeight, bodyPadding, titleHeight]);

  /*
        Определение положений модала после изменений контента
    */
  useEffect(() => {
    const position = modalPositionRef.current;
    const modalMaxHeight = getModalMaxHeight(contentRef);
    const initialHeight =
      bodyRef.current.clientHeight + titleHeight + footerPadding;
    // Определяем высоту для bodyWrapper (ограничитель контента)
    const height =
      modalMaxHeight > initialHeight ? initialHeight : modalMaxHeight;

    position[Visibility.Full] = Math.min(
      initialHeight,
      Math.round(window.innerHeight * MODAL_FULL_FRACTION)
    );

    const bodyWrapper = bodyWrapperRef.current;
    const scrollableWrapper = scrollableWrapperRef.current;

    bodyWrapper.style.height = `${height}px`;
    scrollableWrapper.style.height = `${height - titleHeight}px`;
    hasScrollRef.current =
      scrollableWrapper.offsetHeight !== scrollableWrapper.scrollHeight;
  }, [isOpened, children, orientation, viewport, bodyRefHeight]);

  /*
        Показ и сокрытие модала
    */
  useEffect(() => {
    if (isOpened) {
      setVisibility(Visibility.Initial);
    } else {
      setVisibility(Visibility.Closed);
    }
  }, [isOpened]);

  useEffect(() => {
    if (visibility === Visibility.Initial) {
      const modalVisibility = isModalFullSize
        ? Visibility.Full
        : Visibility.Short;
      setVisibility(modalVisibility);
    }
  }, [visibility]);

  /*
        Перевод модала в укороченое положение, при смене флага
    */
  useEffect(() => {
    if (isOpened && !isScrollable && visibility === Visibility.Full) {
      setVisibility(Visibility.Short);
    }
  }, [isOpened, isScrollable, visibility]);

  /*
        Доводка модала до фиксированных координат
    */
  useEffect(() => {
    contentRef.current.style.transform = `translateY(${-modalPositionRef
      .current[visibility]}px)`;

    if (dispatch) {
      dispatch(modalHeightChangeAction(modalPositionRef.current[visibility]));
    }
  });

  useResize(
    () => {
      setViewport({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    },
    [isOpened, setViewport, viewport],
    isOpened
  );
  useOrientationChange(
    (_, orientation) => {
      setOrientation(orientation);
    },
    [isOpened],
    isOpened
  );

  return [
    modalPositionRef.current[visibility],
    visibility,
    setVisibility,
    hasScrollRef.current,
    hasVisibilityFull,
  ];
};

enum TouchBehavior {
  Dragging = 'Dragging',
  Scrolling = 'Scrolling',
  None = 'None',
}

const ActionSheetContent: FC<ActionSheetProps> = ({
  title,
  children,
  customShadow,
  footer = null,
  pseudoBorder = null,
  initialHeight = null,
  noFooterPadding = false,
  withOverlay = true,
  withSwipeBackground = false,
  withSafePadding = false,
  withBodyPaddingBottom,
  disableOverlayPointerEvents = false,
  disableClosingBySwipe = false,
  isScrollable = false,
  isOpened = false,
  isWebview = true,
  isLocked = false,
  isModalFullSize = false,
  dispatch,
  onVisibilityChange = noop,
  onDragStart = noop,
  onDragEnd = noop,
  zIndex,
}: ActionSheetProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bodyWrapperRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrollableWrapperRef = useRef<HTMLDivElement>(null);
  const modalTitleRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(null);
  const touchBehavior = useRef(TouchBehavior.None);
  const touchIsDraggingRef = useRef(false);
  const isTouchLockedRef = useRef(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const [bodyPadding, setBodyPadding] = useState(EMPTY_OBJECT);
  const [
    modalPosition,
    visibility,
    setVisibility,
    hasScroll,
    hasVisibilityFull,
  ] = useDynamicPosition(
    contentRef,
    bodyWrapperRef,
    bodyRef,
    scrollableWrapperRef,
    modalTitleRef,
    isOpened,
    isScrollable,
    children,
    Boolean(footer),
    initialHeight,
    noFooterPadding,
    dispatch,
    isModalFullSize,
    bodyPadding
  );
  const [isDragging, setIsDragging] = useState(false);
  const handleLockTouch = useCallback((isLocked: boolean) => {
    isTouchLockedRef.current = isLocked;
  }, []);

  const handleDragStateChange = useCallback((isDragging: boolean) => {
    setIsDragging(isDragging);

    if (isDragging) {
      onDragStart();
    } else {
      onDragEnd();
    }
  }, []);

  const handleClose = useCallback(() => {
    setVisibility(Visibility.Closed);
  }, []);

  // IOS имеет "резиновый скролл", из-за чего положение мы не можем знать наверняка, что скролл закончен
  // поэтому устанавливаем скролл принудительно, в случае возникновения события скролла
  const handleScroll = (): void => {
    touchBehavior.current = TouchBehavior.Scrolling;
  };

  usePan(
    (event, touch) => {
      // Проверяем, что событие произошло на потомках ModalBottomMobileContent
      if (!rootRef.current.contains(event.target as Node)) {
        return;
      }
      // eslint-disable-next-line default-case
      switch (touch.state) {
        case Pan.Start:
          touchStartRef.current = Math.round(touch.y);
          touchBehavior.current =
            scrollableWrapperRef.current.scrollTop === 0
              ? TouchBehavior.Dragging
              : TouchBehavior.Scrolling;
          handleDragStateChange(true);
          break;
        case Pan.Move:
          if (touchBehavior.current === TouchBehavior.Scrolling) break;
          if (isTouchLockedRef.current) {
            event.preventDefault();
            break;
          }

          if (
            hasScroll &&
            !touchIsDraggingRef.current &&
            touch.y < touchStartRef.current &&
            scrollableWrapperRef.current.scrollTop === 0 &&
            visibility === Visibility.Full
          ) {
            touchBehavior.current = TouchBehavior.Scrolling;
            break;
          }

          touchIsDraggingRef.current = true;
          event.preventDefault();

          // Блокируем все действия в укороченом положении, если предпологается,
          // что модальное окно будет растянуто на весь экран
          if (visibility === Visibility.Short && isScrollable) {
            event.stopImmediatePropagation();
          }
          // eslint-disable-next-line no-case-declarations
          const touchCurrent = touch.y;
          // eslint-disable-next-line no-case-declarations
          const transform = getDraggingTransformStyle({
            modalPosition,
            touchCurrent,
            touchStart: touchStartRef.current,
          });
          contentRef.current.style.transform = transform;
          break;
        case Pan.End:
          handleDragStateChange(false);
          touchIsDraggingRef.current = false;

          if (
            touchBehavior.current !== TouchBehavior.Dragging ||
            isTouchLockedRef.current
          )
            break;

          // eslint-disable-next-line no-case-declarations
          const touchEnd = touch.y;

          if (
            isScrollable &&
            hasVisibilityFull &&
            touchStartRef.current &&
            touchEnd - touchStartRef.current < -SLIDE_THRESHOLD
          ) {
            setVisibility(Visibility.Full);
          }

          if (
            !disableClosingBySwipe &&
            touchStartRef.current &&
            touchEnd - touchStartRef.current > SLIDE_THRESHOLD
          ) {
            if (
              visibility === Visibility.Full ||
              visibility === Visibility.Short
            ) {
              setVisibility(Visibility.Closed);
            }
          }

          if (
            disableClosingBySwipe &&
            touchStartRef.current &&
            initialHeight &&
            touchEnd - touchStartRef.current > SLIDE_THRESHOLD
          ) {
            setVisibility(Visibility.Short);
          }

          touchBehavior.current = TouchBehavior.None;
          touchStartRef.current = null;
          break;
      }
    },
    [modalPosition, isScrollable, disableClosingBySwipe, hasVisibilityFull],
    isOpened
  );

  usePan(
    (event, touch) => {
      if (touch.state === Pan.Move) {
        event.preventDefault();
      }
    },
    [],
    isOpened && withOverlay,
    overlayRef
  );

  useLayoutEffect(() => {
    if (visibility === Visibility.Initial) {
      onVisibilityChange(Visibility.Initial);
    }
  }, [visibility]);
  useTransition(
    (_, transitionInfo) => {
      if (transitionInfo.state === Transition.End) {
        onVisibilityChange(visibility);
      }
    },
    [visibility],
    true,
    contentRef
  );

  const modalStyle = !withOverlay ? { boxShadow: customShadow } : EMPTY_OBJECT;
  const withFooter = Boolean(footer);
  // установка адаптивного паддинга у боди
  useEffect(() => {
    setBodyPadding(
      withFooter
        ? { paddingBottom: footerRef.current.clientHeight + FOOTER_MARGIN }
        : EMPTY_OBJECT
    );
  }, [withFooter]);

  return (
    <div
      ref={rootRef}
      className={cx('root', {
        root_closed: visibility === Visibility.Closed,
        root_withoutPointerEvents: disableOverlayPointerEvents,
      })}
      data-qa-tag="actionSheet"
      style={{ zIndex }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={overlayRef}
        className={cx('overlay', {
          overlay_closed: visibility === Visibility.Closed,
          overlay_displayNone: !withOverlay,
        })}
        onClick={handleClose}
        data-qa-tag="actionSheetOverlay"
      />
      <div
        ref={contentRef}
        className={cx('content', {
          content_closed: visibility === Visibility.Closed,
          content_isDragging: isDragging,
          content_webview: isWebview,
          content_withShadow: !withOverlay,
          content_locked: isLocked,
        })}
        style={modalStyle}
        data-qa-tag={`actionSheetContent_${visibility}`}
      >
        <header
          className={cx('header', {
            header_withShadow: true,
            header_withSwipeBackground: withSwipeBackground,
            header_webview: isWebview,
          })}
          data-qa-tag="actionSheetHeader"
        />
        <div
          className={cx({
            bodyWrapper_withoutOverlay: !withOverlay,
            bodyWrapper_withSafePadding: withSafePadding,
          })}
          ref={bodyWrapperRef}
        >
          <div ref={modalTitleRef} className={cx('title')}>
            {title}
          </div>
          <div
            className={cx('scrollableWrapper', {
              scrollableWrapper_withScroll: hasScroll,
            })}
            onScroll={handleScroll}
            ref={scrollableWrapperRef}
          >
            <LayoutProvider
              lockTouch={handleLockTouch}
              scrollingElement={scrollableWrapperRef.current}
            >
              <div
                style={bodyPadding}
                className={cx({
                  body_withPaddingBottom: withBodyPaddingBottom,
                })}
                ref={bodyRef}
              >
                {children}
              </div>
            </LayoutProvider>
          </div>
        </div>
      </div>
      {withFooter && (
        <footer
          className={cx('footer', {
            footer_visible: visibility !== Visibility.Closed,
            footer_locked: isLocked,
          })}
          ref={footerRef}
          data-qa-tag="actionSheetFooter"
        >
          {footer}
        </footer>
      )}
      {pseudoBorder}
    </div>
  );
};

export default memo(ActionSheetContent);
