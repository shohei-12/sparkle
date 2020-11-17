import { createSelector } from "reselect";
import { Store } from "../store/types";

const usersSelector = (state: Store) => state.users;

export const getIsSignedIn = createSelector(
  [usersSelector],
  (state) => state.isSignedIn
);

export const getUserId = createSelector([usersSelector], (state) => state.id);
