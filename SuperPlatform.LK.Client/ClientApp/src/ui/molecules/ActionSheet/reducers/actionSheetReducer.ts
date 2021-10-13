export type Action<T extends string, U = undefined> = {
  type: T;
  payload?: U;
};

type State = {
  modalHeight: number;
};

export type ActionSheetAction = Action<'modalHeightChange', number>;

type ActionCreator = (payload: number) => ActionSheetAction;

export const ActionSheetInitialState = {
  modalHeight: 0,
};

export const ActionSheetReducer = (
  state: State = ActionSheetInitialState,
  action: ActionSheetAction
): State => {
  switch (action.type) {
    case 'modalHeightChange':
      return {
        ...state,
        modalHeight: action.payload as any,
      };

    default:
      return state;
  }
};

export const modalHeightChangeAction: ActionCreator = (payload: number) => ({
  payload,
  type: 'modalHeightChange',
});
