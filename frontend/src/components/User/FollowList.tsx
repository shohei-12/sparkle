import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";
import axios from "axios";
import { Store } from "../../re-ducks/store/types";
import { getUserId } from "../../re-ducks/users/selectors";
import { switchTabAction } from "../../re-ducks/users/actions";
import { getFollowings } from "../../re-ducks/relationships/selectors";
import { User } from "../../re-ducks/relationships/types";
import {
  addFollowings,
  follow,
  unfollow,
} from "../../re-ducks/relationships/operations";
import Button from "@material-ui/core/Button";
import NoProfile from "../../assets/img/no-profile.png";
import { baseURL } from "../../config";

type Props = {
  uid: number;
  over: (n: number) => void;
  leave: (n: number) => void;
};

const FollowList: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const uid = props.uid;
  const selector = useSelector((state: Store) => state);
  const currentUserId = Number(getUserId(selector));
  const found = getFollowings(selector).find((ele) => ele.id === uid);
  const followings = found?.followings;
  const start = found?.start;
  const [hasMore, setHasMore] = useState(true);

  const get20Followings = useCallback(() => {
    axios
      .get(`${baseURL}/api/v1/users/${uid}/followings`, {
        params: {
          start,
          uid: localStorage.getItem("uid"),
          client: localStorage.getItem("client"),
          access_token: localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        const twentyFollowings: User[] = res.data;
        if (twentyFollowings.length === 0) {
          setHasMore(false);
          return;
        }
        start !== undefined &&
          dispatch(addFollowings(uid, twentyFollowings, start + 20));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [dispatch, uid, start]);

  return (
    <InfiniteScroll
      loadMore={get20Followings}
      hasMore={hasMore}
      loader={
        <ReactLoading key={0} className="loader" type="spin" color="#03a9f4" />
      }
    >
      {followings &&
        followings.map((ele, i) => (
          <div key={i} className="user">
            <img
              className="profile pointer-h"
              src={ele.profile.url ? baseURL + ele.profile.url : NoProfile}
              alt="プロフィール画像"
              onClick={() => {
                dispatch(switchTabAction(0));
                dispatch(push(`/users/${ele.id}`));
              }}
            />
            <p>{ele.name}</p>
            {ele.id !== currentUserId ? (
              <>
                {ele.following ? (
                  <Button
                    id={`unfollow-btn${i}`}
                    className="unfollow-btn"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      dispatch(unfollow(ele.id, i));
                    }}
                    onMouseOver={() => props.over(i)}
                    onMouseLeave={() => props.leave(i)}
                  >
                    フォロー中
                  </Button>
                ) : (
                  <Button
                    id={`follow-btn${i}`}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      dispatch(follow(ele.id, i));
                    }}
                  >
                    フォロー
                  </Button>
                )}
              </>
            ) : (
              <Button className="hidden">Hidden</Button>
            )}
          </div>
        ))}
    </InfiniteScroll>
  );
};

export default FollowList;
