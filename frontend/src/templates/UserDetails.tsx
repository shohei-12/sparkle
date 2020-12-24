import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Store } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { SecondaryButton } from "../components/UIkit";
import { DetailsTab } from "../components/User";
import "react-calendar/dist/Calendar.css";
import "react-tabs/style/react-tabs.css";
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
  const uid = Number(window.location.pathname.split("/")[2]);

  const [name, setName] = useState("");
  const [profile, setProfile] = useState<string | null>("");
  const [following, setFollowing] = useState(false);
  const [followings, setFollowings] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);

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
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [uid]);

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
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [uid]);

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
        .get(`${baseURL}/api/v1/users/${uid}`)
        .then((res) => {
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
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [uid]);

  return (
    <div className="wrap">
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
            <Button variant="outlined" color="primary" onClick={follow}>
              フォロー
            </Button>
          )}
        </>
      )}
      <DetailsTab
        uid={uid}
        followings={followings}
        followers={followers}
        setFollowings={setFollowings}
        setFollowers={setFollowers}
        over={over}
        leave={leave}
      />
    </div>
  );
};

export default UserDetails;
