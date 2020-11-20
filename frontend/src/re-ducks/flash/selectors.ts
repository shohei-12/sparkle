import { createSelector } from "reselect";
import { Store } from "../store/types";

const flashSelector = (state: Store) => state.flash;

export const getFlashMessage = createSelector(
  [flashSelector],
  (state) => state.msg
);

export const getFlashMessageType = createSelector(
  [flashSelector],
  (state) => state.type
);
