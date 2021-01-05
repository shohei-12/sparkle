import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Store } from "../re-ducks/store/types";
import {
  getUserId,
  getUserName,
  getUserProfile,
} from "../re-ducks/users/selectors";
import { getLikeRecords } from "../re-ducks/records/selectors";
import { createLikeRecordsContainerAction } from "../re-ducks/records/actions";
import { SecondaryButton } from "../components/UIkit";
import { DetailsTab } from "../components/User";
import NoProfile from "../assets/img/no-profile.png";
import { baseURL } from "../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    name: {
      fontWeight: 400,
    },
    profile: {
      width: 200,
      height: 200,
      objectFit: "cover",
      borderRadius: "50%",
    },
    unfollowBtn: {
      "&:hover": {
        backgroundColor: "#f44336",
      },
    },
  })
);

type User = {
  id: number;
  name: string;
  profile: { url: string | null };
  following: boolean;
};

const UserDetails: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const currentUserId = Number(getUserId(selector));
  const currentUserName = getUserName(selector);
  const currentUserProfile = getUserProfile(selector);
  const uid = Number(window.location.pathname.split("/")[2]);
  const likeRecords = getLikeRecords(selector).find((ele) => ele.uid === uid);
  const isBrowserBack = useRef(false);

  const [name, setName] = useState("");
  const [profile, setProfile] = useState<string | null>("");
  const [following, setFollowing] = useState(false);
  const [followings, setFollowings] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [likes, setLikes] = useState(0);

  window.onpopstate = () => {
    isBrowserBack.current = true;
  };

  const goUserEditPage = useCallback(() => {
    dispatch(push(`/users/${currentUserId}/edit`));
  }, [dispatch, currentUserId]);

  const follow = useCallback(() => {
    axios
      .post(`${baseURL}/api/v1/relationships`, {
        id: uid,
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      })
      .then(() => {
        setFollowing(true);
        document.getElementById(
          "unfollow-btn-1"
        )!.firstElementChild!.innerHTML = "フォロー解除";
        followers.push({
          id: currentUserId,
          name: currentUserName,
          profile: { url: currentUserProfile },
          following: false,
        });
        const followersCopy = [...followers];
        setFollowers(followersCopy);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [uid, followers, currentUserId, currentUserName, currentUserProfile]);

  const unfollow = useCallback(() => {
    axios
      .delete(`${baseURL}/api/v1/relationships/${uid}`, {
        data: {
          uid: localStorage.getItem("uid"),
          client: localStorage.getItem("client"),
          access_token: localStorage.getItem("access_token"),
        },
      })
      .then(() => {
        setFollowing(false);
        document.getElementById("follow-btn-1")!.firstElementChild!.innerHTML =
          "フォロー";
        const result = followers.filter((ele) => ele.id !== currentUserId);
        setFollowers(result);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [uid, followers, currentUserId]);

  const over = useCallback((n: number) => {
    document.getElementById(`unfollow-btn${n}`)!.firstElementChild!.innerHTML =
      "フォロー解除";
  }, []);

  const leave = useCallback((n: number) => {
    document.getElementById(`unfollow-btn${n}`)!.firstElementChild!.innerHTML =
      "フォロー中";
  }, []);

  useEffect(() => {
    if (window.location.pathname === `/users/${uid}`) {
      axios
        .get(`${baseURL}/api/v1/users/${uid}`, {
          params: {
            uid: localStorage.getItem("uid"),
            client: localStorage.getItem("client"),
            access_token: localStorage.getItem("access_token"),
          },
        })
        .then((res) => {
          likeRecords || dispatch(createLikeRecordsContainerAction(uid));
          axios
            .get(`${baseURL}/api/v1/relationships/following/${uid}`, {
              params: {
                uid: localStorage.getItem("uid"),
                client: localStorage.getItem("client"),
                access_token: localStorage.getItem("access_token"),
              },
            })
            .then((res) => {
              setFollowing(res.data);
            })
            .catch((error) => {
              throw new Error(error);
            });
          setName(res.data.user.name);
          setProfile(res.data.user.profile.url);
          setFollowings(res.data.follow_list);
          setFollowers(res.data.follower_list);
          setLikes(res.data.likes);
          const scrollYLikeRecords = Number(
            localStorage.getItem("scrollY-like_records")
          );
          if (isBrowserBack.current) {
            if (scrollYLikeRecords) {
              window.scrollTo(0, scrollYLikeRecords);
              localStorage.removeItem("scrollY-like_records");
            }
            isBrowserBack.current = false;
          }
          if (scrollYLikeRecords) {
            localStorage.removeItem("scrollY-like_records");
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [uid, dispatch, likeRecords]);

  return (
    <div className="wrap">
      {name && (
        <>
          <h2 className={classes.name}>{name}</h2>
          <img
            className={classes.profile}
            src={profile ? baseURL + profile : NoProfile}
            alt="プロフィール画像"
          />
          {currentUserId === uid && (
            <SecondaryButton
              text="ユーザー情報を編集する"
              onClick={goUserEditPage}
            />
          )}
          {currentUserId !== uid && (
            <>
              {following ? (
                <Button
                  id="unfollow-btn-1"
                  className={classes.unfollowBtn}
                  variant="contained"
                  color="primary"
                  onClick={unfollow}
                  onMouseOver={() => over(-1)}
                  onMouseLeave={() => leave(-1)}
                >
                  フォロー中
                </Button>
              ) : (
                <Button
                  id="follow-btn-1"
                  variant="outlined"
                  color="primary"
                  onClick={follow}
                >
                  フォロー
                </Button>
              )}
            </>
          )}
          <DetailsTab
            uid={uid}
            currentUserId={currentUserId}
            followings={followings}
            followers={followers}
            likes={likes}
            setFollowings={setFollowings}
            setFollowers={setFollowers}
            setLikes={setLikes}
            over={over}
            leave={leave}
          />
        </>
      )}
    </div>
  );
};

export default UserDetails;
