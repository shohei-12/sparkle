import { createSelector } from 'reselect';
import { Store } from '../store/types';

const relationshipsSelector = (state: Store) => state.relationships;

export const getFollowings = createSelector(
  [relationshipsSelector],
  (state) => state.followings
);

export const getFollowers = createSelector(
  [relationshipsSelector],
  (state) => state.followers
);
