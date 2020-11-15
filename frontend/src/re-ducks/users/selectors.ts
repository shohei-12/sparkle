import { createSelector } from "reselect";
import { Store } from "../store/types";

const usersSelector = (state: Store) => state.users;

export const getUserId = createSelector([usersSelector], (state) => state.uid);
