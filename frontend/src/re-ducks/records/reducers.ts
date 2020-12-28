import * as Actions from "./actions";
import { initialState } from "../store/initialState";
import { RecordAction } from "./types";

export const RecordsReducer = (
  state = initialState.records,
  action: RecordAction
) => {
  switch (action.type) {
    case Actions.GET_RECORDS:
      return {
        ...state,
        records: [...state.records, ...action.payload.records],
        start: action.payload.start,
      };
    case Actions.LIKE_OR_UNLIKE_RECORD:
      return {
        ...state,
      };
    case Actions.GET_LIKE_RECORDS:
      return {
        ...state,
        like_records: {
          records: [
            ...state.like_records.records,
            ...action.payload.like_records,
          ],
          start: action.payload.start,
        },
      };
    default:
      return state;
  }
};
