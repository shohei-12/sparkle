import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import Calendar from "react-calendar";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "react-calendar/dist/Calendar.css";
import "react-tabs/style/react-tabs.css";
import NoProfile from "../../assets/img/no-profile.png";
import { baseURL } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    user: {
      display: "inline-block",
      textAlign: "center",
      [theme.breakpoints.up("xs")]: {
        width: "100%",
        margin: "8px 0",
      },
      [theme.breakpoints.up("sm")]: {
        width: "calc(33.3333% - 16px)",
        margin: 8,
      },
      [theme.breakpoints.up("md")]: {
        width: "calc(20% - 16px)",
        margin: 8,
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
  })
);

type User = {
  id: number;
  name: string;
  profile: { url: string | null };
  following: boolean;
};

type Props = {
  uid: number;
  currentUserId: number;
  followings: User[];
  followers: User[];
  setFollowings: React.Dispatch<React.SetStateAction<User[]>>;
  setFollowers: React.Dispatch<React.SetStateAction<User[]>>;
  over: (n: number) => void;
  leave: (n: number) => void;
};

const DetailsTab: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const uid = props.uid;
  const currentUserId = props.currentUserId;
  const followings = props.followings;
  const followers = props.followers;
  const setFollowings = props.setFollowings;
  const setFollowers = props.setFollowers;

  const goRecordPage = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dispatch(push(`/record/${props.uid}/${year}/${month}/${day}`));
    },
    [dispatch, props.uid]
  );

  const follow = useCallback(
    (id: number, i: number, follow_list: boolean) => {
      axios
        .post(`${baseURL}/api/v1/relationships`, {
          id,
          uid: localStorage.getItem("uid"),
          client: localStorage.getItem("client"),
          access_token: localStorage.getItem("access_token"),
        })
        .then(() => {
          if (uid === currentUserId) {
            const followersCopy = [...followers];
            followersCopy[i].following = true;
            setFollowers(followersCopy);
            document.getElementById(
              `unfollow-btn${i}`
            )!.firstElementChild!.innerHTML = "フォロー解除";
            followings.push(followersCopy[i]);
            const followingsCopy = [...followings];
            setFollowings(followingsCopy);
          } else {
            const followingsCopy = [...followings];
            const found1 = followingsCopy.find((ele) => ele.id === id);
            if (found1) {
              const index = followingsCopy.indexOf(found1);
              followingsCopy[index].following = true;
              setFollowings(followingsCopy);
              if (follow_list) {
                document.getElementById(
                  `unfollow-btn${index}`
                )!.firstElementChild!.innerHTML = "フォロー解除";
              }
            }
            const followersCopy = [...followers];
            const found2 = followersCopy.find((ele) => ele.id === id);
            if (found2) {
              const index = followersCopy.indexOf(found2);
              followersCopy[index].following = true;
              setFollowers(followersCopy);
              if (!follow_list) {
                document.getElementById(
                  `unfollow-btn${index}`
                )!.firstElementChild!.innerHTML = "フォロー解除";
              }
            }
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    [uid, currentUserId, followers, setFollowers, followings, setFollowings]
  );

  const unfollow = useCallback(
    (id: number, i: number, follow_list: boolean) => {
      axios
        .delete(`${baseURL}/api/v1/relationships/${id}`, {
          data: {
            uid: localStorage.getItem("uid"),
            client: localStorage.getItem("client"),
            access_token: localStorage.getItem("access_token"),
          },
        })
        .then(() => {
          if (uid === currentUserId) {
            const result = followings.filter((ele) => ele.id !== id);
            setFollowings(result);
            const followersCopy = [...followers];
            const found = followersCopy.find((ele) => ele.id === id);
            if (found) {
              const index = followersCopy.indexOf(found);
              followersCopy[index].following = false;
              setFollowers(followersCopy);
              const followBtn = document.getElementById(`follow-btn${index}`);
              if (followBtn) {
                followBtn.firstElementChild!.innerHTML = "フォロー";
              }
            }
          } else {
            const followingsCopy = [...followings];
            const found1 = followingsCopy.find((ele) => ele.id === id);
            if (found1) {
              const index = followingsCopy.indexOf(found1);
              followingsCopy[index].following = false;
              setFollowings(followingsCopy);
              if (follow_list) {
                document.getElementById(
                  `follow-btn${index}`
                )!.firstElementChild!.innerHTML = "フォロー";
              }
            }
            const followersCopy = [...followers];
            const found2 = followersCopy.find((ele) => ele.id === id);
            if (found2) {
              const index = followersCopy.indexOf(found2);
              followersCopy[index].following = false;
              setFollowers(followersCopy);
              if (!follow_list) {
                document.getElementById(
                  `follow-btn${index}`
                )!.firstElementChild!.innerHTML = "フォロー";
              }
            }
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    [uid, currentUserId, followings, setFollowings, followers, setFollowers]
  );

  return (
    <Tabs>
      <TabList>
        <Tab>カレンダー</Tab>
        <Tab>{`フォロー ${followings.length}`}</Tab>
        <Tab>{`フォロワー ${followers.length}`}</Tab>
      </TabList>

      <TabPanel>
        <Calendar
          calendarType="US"
          value={new Date()}
          onClickDay={goRecordPage}
        />
      </TabPanel>
      <TabPanel>
        {followings.map((ele, i) => (
          <div key={i} className={classes.user}>
            <img
              className={`${classes.profile} pointer-h`}
              src={ele.profile.url ? baseURL + ele.profile.url : NoProfile}
              alt="プロフィール画像"
              onClick={() => dispatch(push(`/users/${ele.id}`))}
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
                    onClick={() => unfollow(ele.id, i, true)}
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
                    onClick={() => follow(ele.id, i, true)}
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
      </TabPanel>
      <TabPanel>
        {followers.map((ele, i) => (
          <div key={i} className={classes.user}>
            <img
              className={`${classes.profile} pointer-h`}
              src={ele.profile.url ? baseURL + ele.profile.url : NoProfile}
              alt="プロフィール画像"
              onClick={() => dispatch(push(`/users/${ele.id}`))}
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
                    onClick={() => unfollow(ele.id, i, false)}
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
                    onClick={() => follow(ele.id, i, false)}
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
      </TabPanel>
    </Tabs>
  );
};

export default DetailsTab;