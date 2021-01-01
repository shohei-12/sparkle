import * as Actions from "./actions";
import { initialState } from "../store/initialState";
import { RecordAction } from "./types";

export const RecordsReducer = (
  state = initialState.records,
  action: RecordAction
) => {
  switch (action.type) {
    case Actions.ADD_RECORDS:
      return {
        ...state,
        records: [...state.records, ...action.payload.records],
        start: action.payload.start,
      };
    case Actions.LIKE_OR_UNLIKE_RECORD:
      return {
        ...state,
      };
    case Actions.ADD_LIKE_RECORDS:
      return {
        ...state,
      };
    case Actions.CREATE_LIKE_RECORDS_CONTAINER:
      return {
        ...state,
        like_records: [...state.like_records, action.payload],
      };
    default:
      return state;
  }
};
