import * as Actions from "./actions";
import { initialState } from "../store/initialState";
import { UserAction } from "./types";

export const UsersReducer = (
  state = initialState.users,
  action: UserAction
) => {
  switch (action.type) {
    case Actions.SIGN_IN:
      return {
        ...action.payload,
      };
    case Actions.SIGN_OUT:
      return {
        ...state,
        ...action.payload,
      };
    case Actions.USER_UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    case Actions.THEME_TOGGLE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
