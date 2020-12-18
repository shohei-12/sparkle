import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import Calendar from "react-calendar";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Store } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { SecondaryButton } from "../components/UIkit";
import "react-calendar/dist/Calendar.css";
import NoProfile from "../assets/img/no-profile.png";
import { baseURL } from "../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const UserDetails: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const currentUserId = getUserId(selector);
  const uid = window.location.pathname.split("/")[2];

  const [name, setName] = useState("");
  const [profile, setProfile] = useState<string | null>("");
  const [following, setFollowing] = useState(false);
  const [unfollowBtnText, setUnfollowBtnText] = useState("フォロー中");

  const goUserEditPage = useCallback(() => {
    dispatch(push("/user/edit"));
  }, [dispatch]);

  const goDailyRecordPage = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dispatch(push(`/daily-record/${year}/${month}/${day}`));
    },
    [dispatch]
  );

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

  const over = useCallback(() => {
    setUnfollowBtnText("フォロー解除");
  }, [setUnfollowBtnText]);

  const leave = useCallback(() => {
    setUnfollowBtnText("フォロー中");
  }, [setUnfollowBtnText]);

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
          setName(res.data.name);
          setProfile(res.data.profile.url);
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [uid]);

  return (
    <div className="wrap">
      <h2>My Page</h2>
      <img
        className={classes.profile}
        src={profile ? baseURL + profile : NoProfile}
        alt="プロフィール画像"
      />
      <span>{name}</span>
      <SecondaryButton text="ユーザー情報を編集する" onClick={goUserEditPage} />
      {currentUserId !== uid && (
        <>
          {following ? (
            <Button
              className={classes.unfollowBtn}
              variant="contained"
              color="primary"
              onClick={unfollow}
              onMouseOver={over}
              onMouseLeave={leave}
            >
              {unfollowBtnText}
            </Button>
          ) : (
            <Button variant="outlined" color="primary" onClick={follow}>
              フォロー
            </Button>
          )}
        </>
      )}
      <Calendar
        calendarType="US"
        value={new Date()}
        onClickDay={goDailyRecordPage}
      />
    </div>
  );
};

export default UserDetails;
