import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Store } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { getLikeRecords } from "../re-ducks/records/selectors";
import { createLikeRecordsContainerAction } from "../re-ducks/records/actions";
import { getFollowings } from "../re-ducks/relationships/selectors";
import { follow, unfollow } from "../re-ducks/relationships/operations";
import { createRelationshipContainerAction } from "../re-ducks/relationships/actions";
import { TextInput, SecondaryButton } from "../components/UIkit";
import { DetailsTab } from "../components/User";
import NoProfile from "../assets/img/no-profile.png";
import { baseURL } from "../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      marginBottom: 20,
      textAlign: "center",
      [theme.breakpoints.up("sm")]: {
        display: "flex",
        alignItems: "flex-end",
        textAlign: "start",
      },
    },
    left: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    name: {
      order: 2,
      fontWeight: 400,
    },
    profile: {
      margin: "0 auto",
      order: 1,
      width: 200,
      height: 200,
      objectFit: "cover",
      borderRadius: "50%",
    },
    right: {
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: 15,
      },
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
  const currentUserId = Number(getUserId(selector));
  const uid = Number(window.location.pathname.split("/")[2]);
  const likeRecords = getLikeRecords(selector).find((ele) => ele.uid === uid);
  const followings = getFollowings(selector).find((ele) => ele.id === uid);
  const isBrowserBack = useRef(false);

  const [name, setName] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [profile, setProfile] = useState<string | null>("");
  const [following, setFollowing] = useState(false);
  const [followingsLength, setFollowingsLength] = useState(0);
  const [followersLength, setFollowersLength] = useState(0);
  const [likes, setLikes] = useState(0);

  window.onpopstate = () => {
    isBrowserBack.current = true;
  };

  const goUserEditPage = useCallback(() => {
    dispatch(push(`/users/${currentUserId}/edit`));
  }, [dispatch, currentUserId]);

  const dispatchFollow = useCallback(() => {
    setFollowing(true);
    dispatch(follow(uid, -1));
  }, [dispatch, uid]);

  const dispatchUnfollow = useCallback(() => {
    setFollowing(false);
    dispatch(unfollow(uid, -1));
  }, [dispatch, uid]);

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
      followings || dispatch(createRelationshipContainerAction(uid));
      likeRecords || dispatch(createLikeRecordsContainerAction(uid));
      axios
        .get(`${baseURL}/api/v1/users/${uid}`, {
          params: {
            uid: localStorage.getItem("uid"),
            client: localStorage.getItem("client"),
            access_token: localStorage.getItem("access_token"),
          },
        })
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
          res.data.user.self_introduction
            ? setSelfIntroduction(res.data.user.self_introduction)
            : setSelfIntroduction("");
          setProfile(res.data.user.profile.url);
          setFollowingsLength(res.data.followings);
          setFollowersLength(res.data.followers);
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
  }, [uid, dispatch, likeRecords, followings]);

  return (
    <div className="wrap">
      {name && (
        <>
          <div className={classes.flex}>
            <div className={classes.left}>
              <h2 className={classes.name}>{name}</h2>
              <img
                className={classes.profile}
                src={profile ? baseURL + profile : NoProfile}
                alt="プロフィール画像"
              />
            </div>
            <div className={classes.right}>
              <TextInput
                fullWidth={true}
                label="自己紹介"
                multiline={true}
                required={false}
                rows="7"
                type="text"
                name="selfIntroduction"
                inputProps={{
                  disabled: true,
                }}
                value={selfIntroduction}
                variant="outlined"
              />
              <div className="space-m"></div>
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
                      onClick={dispatchUnfollow}
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
                      onClick={dispatchFollow}
                    >
                      フォロー
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <DetailsTab
            uid={uid}
            currentUserId={currentUserId}
            followingsLength={followingsLength}
            followersLength={followersLength}
            likes={likes}
            setFollowingsLength={setFollowingsLength}
            setFollowersLength={setFollowersLength}
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
