import { createSelector } from "reselect";
import { Store } from "../store/types";

const usersSelector = (state: Store) => state.users;

export const getIsSignedIn = createSelector(
  [usersSelector],
  (state) => state.isSignedIn
);

export const getUserId = createSelector([usersSelector], (state) => state.id);

export const getUserName = createSelector(
  [usersSelector],
  (state) => state.name
);

export const getUserEmail = createSelector(
  [usersSelector],
  (state) => state.email
);

export const getUserProfile = createSelector(
  [usersSelector],
  (state) => state.profile
);

export const getTheme = createSelector([usersSelector], (state) => state.theme);
