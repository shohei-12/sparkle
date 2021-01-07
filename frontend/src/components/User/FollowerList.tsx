import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";
import axios from "axios";
import { Store } from "../../re-ducks/store/types";
import { getUserId } from "../../re-ducks/users/selectors";
import { switchTabAction } from "../../re-ducks/users/actions";
import { getFollowers } from "../../re-ducks/relationships/selectors";
import { User } from "../../re-ducks/relationships/types";
import {
  addFollowers,
  follow,
  unfollow,
} from "../../re-ducks/relationships/operations";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import NoProfile from "../../assets/img/no-profile.png";
import { baseURL } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    user: {
      display: "inline-block",
      textAlign: "center",
      margin: 8,
      [theme.breakpoints.up("xs")]: {
        width: "calc(50% - 16px)",
      },
      [theme.breakpoints.up("sm")]: {
        width: "calc(33.3333% - 16px)",
      },
      [theme.breakpoints.up("md")]: {
        width: "calc(20% - 16px)",
      },
    },
    profile: {
      width: 100,
      height: 100,
      objectFit: "cover",
      borderRadius: "50%",
    },
    unfollowBtn: {
      "&:hover": {
        backgroundColor: "#f44336",
      },
    },
    hidden: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        visibility: "hidden",
        display: "inline-block",
      },
    },
    loader: {
      margin: "0 auto",
    },
  })
);

type Props = {
  uid: number;
  over: (n: number) => void;
  leave: (n: number) => void;
};

const FollowerList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const uid = props.uid;
  const selector = useSelector((state: Store) => state);
  const currentUserId = Number(getUserId(selector));
  const found = getFollowers(selector).find((ele) => ele.id === uid);
  const followers = found?.followers;
  const start = found?.start;
  const [hasMore, setHasMore] = useState(true);

  const get20Followers = useCallback(() => {
    axios
      .get(`${baseURL}/api/v1/users/${uid}/followers`, {
        params: {
          start,
          uid: localStorage.getItem("uid"),
          client: localStorage.getItem("client"),
          access_token: localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        const twentyFollowers: User[] = res.data;
        if (twentyFollowers.length === 0) {
          setHasMore(false);
          return;
        }
        start !== undefined &&
          dispatch(addFollowers(uid, twentyFollowers, start + 20));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [dispatch, uid, start]);

  return (
    <InfiniteScroll
      loadMore={get20Followers}
      hasMore={hasMore}
      threshold={0}
      loader={
        <ReactLoading
          key={0}
          className={classes.loader}
          type="spin"
          color="#03a9f4"
        />
      }
    >
      {followers &&
        followers.map((ele, i) => (
          <div key={i} className={classes.user}>
            <img
              className={`${classes.profile} pointer-h`}
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
                    className={classes.unfollowBtn}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      dispatch(unfollow(ele.id, i, uid, "follower"));
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
                      dispatch(follow(ele.id, i, uid, "follower"));
                    }}
                  >
                    フォロー
                  </Button>
                )}
              </>
            ) : (
              <Button className={classes.hidden}>Hidden</Button>
            )}
          </div>
        ))}
    </InfiniteScroll>
  );
};

export default FollowerList;
