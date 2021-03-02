import { createSelector } from 'reselect';
import { Store } from '../store/types';

const recordsSelector = (state: Store) => state.records;

export const getRecords = createSelector(
  [recordsSelector],
  (state) => state.records
);

export const getStart = createSelector(
  [recordsSelector],
  (state) => state.start
);

export const getLikeRecords = createSelector(
  [recordsSelector],
  (state) => state.like_records
);
