import { User, Followings, Followers } from "./types";
import { addFollowingsFollowersAction } from "./actions";

export const addFollowings = (
  uid: number,
  twentyFollowings: User[],
  nextStart: number
) => {
  return (dispatch: any, getState: any) => {
    const followings = getState().relationships.followings as Followings[];
    const found = followings.find((ele) => ele.id === uid)!;
    found.followings = [...found.followings, ...twentyFollowings];
    found.start = nextStart;
    dispatch(addFollowingsFollowersAction());
  };
};

export const addFollowers = (
  uid: number,
  twentyFollowers: User[],
  nextStart: number
) => {
  return (dispatch: any, getState: any) => {
    const followers = getState().relationships.followers as Followers[];
    const found = followers.find((ele) => ele.id === uid)!;
    found.followers = [...found.followers, ...twentyFollowers];
    found.start = nextStart;
    dispatch(addFollowingsFollowersAction());
  };
};
