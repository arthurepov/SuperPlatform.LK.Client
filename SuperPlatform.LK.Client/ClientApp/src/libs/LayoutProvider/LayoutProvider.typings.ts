export type Viewport = {
  top: number;
  height: number;
  width: number;
  bottom: number;
  margin: number;
  left: number;
  right: number;
  marginHorizontal: number;
};

export enum LayoutItemState {
  ENTER,
  UPDATE,
  IDLE,
  EXIT,
}

export type Position = {
  x: number;
  y: number;
};

export type Bound = {
  top: number;
  bottom: number;
};

export type LayoutItem<ItemData> = {
  data: ItemData;
  [key: string]: any;
};

export type LayoutData<ItemData> = {
  height: number;
  width: number;
  top: number;
  items: LayoutItem<ItemData>[];
};

export type LayoutReducer<ItemData, LayoutProps> = (
  accumulator: LayoutData<ItemData>,
  item: Readonly<ItemData>,
  index: Readonly<number>,
  layoutProps: Readonly<LayoutProps>
) => LayoutData<ItemData>;

export type Layout<ItemData, LayoutProps> = (
  layoutProps: LayoutProps,
  items: ItemData[]
) => LayoutData<ItemData>;

export interface CreateLayout {
  <ItemData, LayoutProps>(
    layoutReducer: LayoutReducer<ItemData, LayoutProps>
  ): Layout<ItemData, LayoutProps>;
}

export type TODO_ANY = any;
