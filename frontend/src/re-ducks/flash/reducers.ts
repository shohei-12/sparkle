import * as Actions from './actions';
import { initialState } from '../store/initialState';
import { FlashAction } from './types';

export const FlashReducer = (state = initialState.flash, action: FlashAction) => {
  switch (action.type) {
    case Actions.FLASH:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};
