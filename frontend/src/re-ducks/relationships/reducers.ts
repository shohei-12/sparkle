import * as Actions from "./actions";
import { initialState } from "../store/initialState";
import { RelationshipAction } from "./types";

export const RelationshipsReducer = (
  state = initialState.relationships,
  action: RelationshipAction
) => {
  switch (action.type) {
    case Actions.NON_PAYLOAD:
      return {
        ...state,
      };
    case Actions.CREATE_RELATIONSHIP_CONTAINER:
      return {
        followings: [...state.followings, action.payload.followings],
        followers: [...state.followers, action.payload.followers],
      };
    default:
      return state;
  }
};
