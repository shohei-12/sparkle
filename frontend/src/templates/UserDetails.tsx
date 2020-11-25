import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import Calendar from "react-calendar";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { getUserName, getUserProfile } from "../re-ducks/users/selectors";
import { Store } from "../re-ducks/store/types";
import { SecondaryButton } from "../components/UIkit";
import "react-calendar/dist/Calendar.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    profile: {
      width: 200,
      height: 200,
      borderRadius: "50%",
    },
  })
);

const UserDetails = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const name = getUserName(selector);
  const profile = getUserProfile(selector);

  const goUserEditPage = useCallback(() => {
    dispatch(push("/user/edit"));
  }, [dispatch]);

  const goDailyRecordPage = useCallback(
    (value: any) => {
      console.log(value);
      dispatch(push("/daily-record"));
    },
    [dispatch]
  );

  return (
    <div className="wrap">
      <h2>My Page</h2>
      <img
        className={classes.profile}
        src={`http://localhost${profile}`}
        alt="プロフィール画像"
        width="100"
        height="100"
      />
      <span>{name}</span>
      <SecondaryButton text="ユーザー情報を編集する" onClick={goUserEditPage} />
      <Calendar
        calendarType="US"
        value={new Date()}
        onClickDay={goDailyRecordPage}
      />
    </div>
  );
};

export default UserDetails;
