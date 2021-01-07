import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import Calendar from "react-calendar";
import axios from "axios";
import { FollowList, FollowerList } from ".";
import { LikeRecordList } from "../Record";
import { switchTabAction } from "../../re-ducks/users/actions";
import { getTabIndex } from "../../re-ducks/users/selectors";
import { Store } from "../../re-ducks/store/types";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "react-calendar/dist/Calendar.css";
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
  })
);

type Props = {
  uid: number;
  currentUserId: number;
  followingsLength: number;
  followersLength: number;
  likes: number;
  setFollowingsLength: React.Dispatch<React.SetStateAction<number>>;
  setFollowersLength: React.Dispatch<React.SetStateAction<number>>;
  setLikes: React.Dispatch<React.SetStateAction<number>>;
  over: (n: number) => void;
  leave: (n: number) => void;
};

const DetailsTab: React.FC<Props> = (props) => {
  const classes = useStyles();
  const uid = props.uid;
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const tabIndex = getTabIndex(selector);
  const currentUserId = props.currentUserId;
  const followingsLength = props.followingsLength;
  const followersLength = props.followersLength;
  const setFollowingsLength = props.setFollowingsLength;
  const setFollowersLength = props.setFollowersLength;

  const goRecordPage = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dispatch(push(`/record/${props.uid}/${year}/${month}/${day}`));
    },
    [dispatch, props.uid]
  );

  // const follow = useCallback(
  //   (id: number, i: number, follow_list: boolean) => {
  //     axios
  //       .post(`${baseURL}/api/v1/relationships`, {
  //         id,
  //         uid: localStorage.getItem("uid"),
  //         client: localStorage.getItem("client"),
  //         access_token: localStorage.getItem("access_token"),
  //       })
  //       .then(() => {
  //         if (uid === currentUserId) {
  //           const followersCopy = [...followers];
  //           followersCopy[i].following = true;
  //           setFollowers(followersCopy);
  //           document.getElementById(
  //             `unfollow-btn${i}`
  //           )!.firstElementChild!.innerHTML = "フォロー解除";
  //           followings.push(followersCopy[i]);
  //           const followingsCopy = [...followings];
  //           setFollowings(followingsCopy);
  //         } else {
  //           const followingsCopy = [...followings];
  //           const found1 = followingsCopy.find((ele) => ele.id === id);
  //           if (found1) {
  //             const index = followingsCopy.indexOf(found1);
  //             followingsCopy[index].following = true;
  //             setFollowings(followingsCopy);
  //             if (follow_list) {
  //               document.getElementById(
  //                 `unfollow-btn${index}`
  //               )!.firstElementChild!.innerHTML = "フォロー解除";
  //             }
  //           }
  //           const followersCopy = [...followers];
  //           const found2 = followersCopy.find((ele) => ele.id === id);
  //           if (found2) {
  //             const index = followersCopy.indexOf(found2);
  //             followersCopy[index].following = true;
  //             setFollowers(followersCopy);
  //             if (!follow_list) {
  //               document.getElementById(
  //                 `unfollow-btn${index}`
  //               )!.firstElementChild!.innerHTML = "フォロー解除";
  //             }
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         throw new Error(error);
  //       });
  //   },
  //   [uid, currentUserId, followers, setFollowers, followings, setFollowings]
  // );

  // const unfollow = useCallback(
  //   (id: number, i: number, follow_list: boolean) => {
  //     axios
  //       .delete(`${baseURL}/api/v1/relationships/${id}`, {
  //         data: {
  //           uid: localStorage.getItem("uid"),
  //           client: localStorage.getItem("client"),
  //           access_token: localStorage.getItem("access_token"),
  //         },
  //       })
  //       .then(() => {
  //         if (uid === currentUserId) {
  //           const result = followings.filter((ele) => ele.id !== id);
  //           setFollowings(result);
  //           const followersCopy = [...followers];
  //           const found = followersCopy.find((ele) => ele.id === id);
  //           if (found) {
  //             const index = followersCopy.indexOf(found);
  //             followersCopy[index].following = false;
  //             setFollowers(followersCopy);
  //             const followBtn = document.getElementById(`follow-btn${index}`);
  //             if (followBtn) {
  //               followBtn.firstElementChild!.innerHTML = "フォロー";
  //             }
  //           }
  //         } else {
  //           const followingsCopy = [...followings];
  //           const found1 = followingsCopy.find((ele) => ele.id === id);
  //           if (found1) {
  //             const index = followingsCopy.indexOf(found1);
  //             followingsCopy[index].following = false;
  //             setFollowings(followingsCopy);
  //             if (follow_list) {
  //               document.getElementById(
  //                 `follow-btn${index}`
  //               )!.firstElementChild!.innerHTML = "フォロー";
  //             }
  //           }
  //           const followersCopy = [...followers];
  //           const found2 = followersCopy.find((ele) => ele.id === id);
  //           if (found2) {
  //             const index = followersCopy.indexOf(found2);
  //             followersCopy[index].following = false;
  //             setFollowers(followersCopy);
  //             if (!follow_list) {
  //               document.getElementById(
  //                 `follow-btn${index}`
  //               )!.firstElementChild!.innerHTML = "フォロー";
  //             }
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         throw new Error(error);
  //       });
  //   },
  //   [uid, currentUserId, followings, setFollowings, followers, setFollowers]
  // );

  return (
    <>
      <ul className="tabs">
        {tabIndex === 0 ? (
          <li className="tab tab-selected">カレンダー</li>
        ) : (
          <li className="tab" onClick={() => dispatch(switchTabAction(0))}>
            カレンダー
          </li>
        )}
        {tabIndex === 1 ? (
          <li className="tab tab-selected">{`フォロー ${followingsLength}`}</li>
        ) : (
          <li
            className="tab"
            onClick={() => dispatch(switchTabAction(1))}
          >{`フォロー ${followingsLength}`}</li>
        )}
        {tabIndex === 2 ? (
          <li className="tab tab-selected">{`フォロワー ${followersLength}`}</li>
        ) : (
          <li
            className="tab"
            onClick={() => dispatch(switchTabAction(2))}
          >{`フォロワー ${followersLength}`}</li>
        )}
        {tabIndex === 3 ? (
          <li className="tab tab-selected">{`いいね ${props.likes}`}</li>
        ) : (
          <li
            className="tab"
            onClick={() => dispatch(switchTabAction(3))}
          >{`いいね ${props.likes}`}</li>
        )}
      </ul>
      {tabIndex === 0 && (
        <Calendar
          calendarType="US"
          value={new Date()}
          onClickDay={goRecordPage}
        />
      )}
      {tabIndex === 1 && (
        <FollowList uid={uid} over={props.over} leave={props.leave} />
      )}
      {tabIndex === 2 && (
        <FollowerList uid={uid} over={props.over} leave={props.leave} />
      )}
      {tabIndex === 3 && (
        <LikeRecordList
          uid={uid}
          likes={props.likes}
          setLikes={props.setLikes}
        />
      )}
    </>
  );
};

export default DetailsTab;
