import axios from 'axios';
import { User, Followings, Followers } from './types';
import { nonPayloadAction } from './actions';
import { baseURL } from '../../config';

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
    dispatch(nonPayloadAction());
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
    dispatch(nonPayloadAction());
  };
};

export const follow = (id: number, i: number) => {
  return (dispatch: any, getState: any) => {
    axios
      .post(`${baseURL}/api/v1/relationships`, {
        id,
        uid: localStorage.getItem('uid'),
        client: localStorage.getItem('client'),
        access_token: localStorage.getItem('access_token'),
      })
      .then(() => {
        const followings = getState().relationships.followings as Followings[];
        const followers = getState().relationships.followers as Followers[];
        for (const ele of followings) {
          const found = ele.followings.find((ele) => ele.id === id);
          if (found) {
            found.following = true;
          }
        }
        for (const ele of followers) {
          const found = ele.followers.find((ele) => ele.id === id);
          if (found) {
            found.following = true;
          }
        }
        dispatch(nonPayloadAction());
        document.getElementById(
          `unfollow-btn${i}`
        )!.firstElementChild!.innerHTML = 'フォロー解除';
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const unfollow = (id: number, i: number) => {
  return (dispatch: any, getState: any) => {
    axios
      .delete(`${baseURL}/api/v1/relationships/${id}`, {
        data: {
          uid: localStorage.getItem('uid'),
          client: localStorage.getItem('client'),
          access_token: localStorage.getItem('access_token'),
        },
      })
      .then(() => {
        const followings = getState().relationships.followings as Followings[];
        const followers = getState().relationships.followers as Followers[];
        for (const ele of followings) {
          const found = ele.followings.find((ele) => ele.id === id);
          if (found) {
            found.following = false;
          }
        }
        for (const ele of followers) {
          const found = ele.followers.find((ele) => ele.id === id);
          if (found) {
            found.following = false;
          }
        }
        dispatch(nonPayloadAction());
        document.getElementById(
          `follow-btn${i}`
        )!.firstElementChild!.innerHTML = 'フォロー';
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};
