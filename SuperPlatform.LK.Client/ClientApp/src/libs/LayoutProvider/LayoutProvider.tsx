// @ts-nocheck
/* eslint-disable no-restricted-globals, @typescript-eslint/explicit-function-return-type, react/destructuring-assignment, react/sort-comp, react/no-access-state-in-setstate */
import React, { PureComponent } from 'react';

import debounce from '../debounce';
import isNull from '../nil';
import any from '../any';
import isTrue from '../isTrue';
import noop from '../noop';

import { LayoutContext } from './LayoutContext';

import { intersects } from './LayoutProvider.utils';
import { LayoutItem, Viewport, TODO_ANY } from './LayoutProvider.typings';

const ONE_THIRD = 1 / 3;
const RESIZE_DEBOUNCE_DELAY = 350;

export type LayoutMap = Record<string, LayoutItem<TODO_ANY>>;
export type LayoutDataMap = Record<
  string,
  {
    items: [];
    layoutProps: any;
    layoutReducer?: (items: [], layoutProps: any) => LayoutItem<TODO_ANY>[];
  }
>;

type VisibleItemsProps = { top: number; left: number; items: any[] };

export type LayoutContextState = {
  viewport: Viewport;
  layoutDataMap: Record<string, { top: number; bottom: number }>;
  lockTouch: (isLocked: boolean) => void;
  register: (id: string, layoutData: any) => void;
  update: (id: string, layoutData: any) => void;
  unregister: (id: string) => void;
  getVisibleItems: (id: string, props: VisibleItemsProps) => any[];
  scrollTo: (props: ScrollOptions, signal?: AbortSignal) => Promise<void>;
  enableScroll: (context: string) => void;
  disableScroll: (context: string) => void;
  getScrollingElement: () => HTMLElement | Element;
  scrollContextMap: Record<string, boolean>;
};

type LayoutProviderProps = {
  lockTouch?: (isLocked: boolean) => void;
  scrollingElement?: HTMLElement;
  direction?: 'vertical' | 'horizontal';
};

export class LayoutProvider extends PureComponent<
  LayoutProviderProps,
  LayoutContextState
> {
  private scrollContextMap: Record<string, boolean> = {};

  rafId: number | null = null;

  private previousScrollHeight = 0;

  private previousScrollWidth = 0;

  // eslint-disable-next-line react/static-property-placement
  static defaultProps: LayoutProviderProps = {
    lockTouch: (isLocked: boolean) => {},
    scrollingElement: undefined,
  };

  static getDerivedStateFromProps(
    { lockTouch }: LayoutProviderProps,
    state: LayoutContextState
  ) {
    if (state.lockTouch !== lockTouch) {
      return {
        ...state,
        lockTouch,
      };
    }

    return null;
  }

  constructor(props: LayoutProviderProps) {
    super(props);

    this.state = {
      viewport: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        margin: 0,
        marginHorizontal: 0,
      },
      layoutDataMap: {},
      lockTouch: this.props.lockTouch || noop,
      register: this.register,
      update: this.update,
      unregister: this.unregister,
      scrollTo: this.scrollTo,
      disableScroll: this.disableScroll,
      enableScroll: this.enableScroll,
      getVisibleItems: this.getVisibleItems,
      getScrollingElement: this.getScrollingElement,
      scrollContextMap: this.scrollContextMap,
    };
  }

  componentDidMount() {
    const scrollingElement = this.getScrollingElement();

    scrollingElement.addEventListener('scroll', this.handleScroll as any, {
      passive: true,
    });
    window.addEventListener('resize', this.handleResize as any, {
      passive: true,
    });

    this.updateViewport();
  }

  componentDidUpdate(prevProps: LayoutProviderProps) {
    const { scrollHeight } = this.getScrollingElement();
    const { scrollWidth } = this.getScrollingElement();

    if (scrollHeight !== this.previousScrollHeight) {
      this.updateViewport();
      this.previousScrollHeight = scrollHeight;
    }

    if (scrollWidth !== this.previousScrollWidth) {
      this.updateViewport();
      this.previousScrollWidth = scrollWidth;
    }

    if (prevProps.scrollingElement === this.props.scrollingElement) {
      return;
    }

    const prevScrollingElement =
      prevProps.scrollingElement || (document.scrollingElement as HTMLElement);
    prevScrollingElement.removeEventListener(
      'scroll',
      this.handleScroll as any
    );

    const scrollingElement = this.getScrollingElement();

    scrollingElement.addEventListener('scroll', this.handleScroll as any, {
      passive: true,
    });
  }

  componentWillUnmount() {
    const scrollingElement = this.getScrollingElement();

    scrollingElement.removeEventListener('scroll', this.handleScroll as any);
    window.removeEventListener('resize', this.handleResize as any);
  }

  private updateViewport = (
    futureX: number | null = null,
    futureY: number | null = null
  ) => {
    const { viewport } = this.state;
    const { direction = 'vertical' } = this.props;
    const scrollingElement = this.getScrollingElement();
    const { scrollHeight } = this.getScrollingElement();
    const { scrollWidth } = this.getScrollingElement();

    const y = isNull(futureY) ? scrollingElement.scrollTop : futureY;
    const top = Math.max(y || 0, 0);
    const bottom = Math.min(top + innerHeight, scrollHeight);
    const margin = innerHeight * ONE_THIRD;

    const x = isNull(futureX) ? scrollingElement.scrollLeft : futureX;
    const left = Math.max(x || 0, 0);
    const right = Math.min(left + innerWidth, scrollWidth);
    const marginHorizontal = innerWidth * ONE_THIRD;

    if (
      direction === 'vertical' &&
      futureY === null &&
      ((y < 0 && viewport.top < margin) ||
        (y + innerHeight > scrollHeight && viewport.bottom > scrollHeight))
    ) {
      return;
    }

    if (
      direction === 'horizontal' &&
      futureX === null &&
      ((x < 0 && viewport.left < marginHorizontal) ||
        (x + innerWidth > scrollWidth && viewport.right > scrollWidth))
    ) {
      return;
    }

    this.setState({
      viewport: {
        margin,
        top,
        right,
        bottom,
        left,
        marginHorizontal,
        width: innerWidth,
        height: innerHeight,
      },
    });
  };

  private disableScroll = (contextKey = 'default') => {
    this.scrollContextMap[contextKey] = true;

    if (any(isTrue, this.scrollContextMap)) {
      document.documentElement.style.overflow = ' hidden';
    }
  };

  private enableScroll = (contextKey = 'default') => {
    this.scrollContextMap[contextKey] = false;

    if (!any(isTrue, this.scrollContextMap)) {
      document.documentElement.style.overflow = '';
    }
  };

  private handleScroll = () => {
    cancelAnimationFrame(this.rafId);

    this.rafId = requestAnimationFrame(() => {
      this.updateViewport();
    });
  };

  private handleResize = debounce(RESIZE_DEBOUNCE_DELAY, this.updateViewport);

  private register = (id: string, layoutData: any) => {
    if (this.state.layoutDataMap[id]) {
      return;
    }

    this.setState({
      layoutDataMap: {
        ...this.state.layoutDataMap,
        [id]: layoutData as any,
      },
    });
    this.updateViewport();
  };

  private update = (id: string, layoutData: any) => {
    this.setState({
      layoutDataMap: {
        ...this.state.layoutDataMap,
        [id]: layoutData as any,
      },
    });
  };

  private unregister = (id: string) => {
    const layoutDataMap = { ...this.state.layoutDataMap };

    delete layoutDataMap[id];

    this.setState({
      layoutDataMap,
    });
  };

  private isVisible = (id: string, item: any, { top, left }: any): boolean => {
    const { viewport } = this.state;
    const itemBounds = {
      top: item.position.y + top,
      bottom: item.position.y + item.height + top,
    };
    const viewportBounds = {
      top: viewport.top - viewport.margin,
      bottom: viewport.bottom + viewport.margin,
    };

    return intersects(itemBounds, viewportBounds);
  };

  private scrollTo = (
    { left = 0, top = 0, behavior = 'auto' }: ScrollToOptions = {},
    signal?: AbortSignal
  ): Promise<void> => {
    this.updateViewport(left, top);

    const element = this.getScrollingElement();

    element.scrollTo({ left, top, behavior });

    if (signal && signal.aborted) {
      return Promise.reject();
    }

    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      if (signal) {
        signal.addEventListener('abort', reject);
      }

      if (behavior === 'auto' || Math.ceil(element.scrollTop) >= top) {
        return resolve();
      }

      const handleSmoothScrollEnd = () => {
        if (Math.ceil(element.scrollTop) >= top) {
          resolve();
          element.removeEventListener('scroll', handleSmoothScrollEnd);
        }
      };

      element.addEventListener('scroll', handleSmoothScrollEnd);
    });
  };

  private getVisibleItems = (
    id: string,
    { items, top, left }: VisibleItemsProps
  ) => {
    return items.filter((item) => this.isVisible(id, item, { top, left }));
  };

  getScrollingElement = () => {
    return (this.props.scrollingElement ||
      document.scrollingElement) as HTMLElement;
  };

  render() {
    return (
      <LayoutContext.Provider value={this.state}>
        {this.props.children}
      </LayoutContext.Provider>
    );
  }
}
