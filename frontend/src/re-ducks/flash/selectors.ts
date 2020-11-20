import { createSelector } from "reselect";
import { Store } from "../store/types";

const flashSelector = (state: Store) => state.flash;

export const getFlashMsg = createSelector(
  [flashSelector],
  (state) => state.msg
);
