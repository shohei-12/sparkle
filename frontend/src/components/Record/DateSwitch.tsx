import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dateSwitch: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    date: {
      margin: "0 20px",
    },
    switch: {
      color: theme.palette.secondary.main,
    },
  })
);

type Props = {
  date: Date;
};

const DateSwitch: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const date = props.date;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const oneDayLater = useCallback(() => {
    date.setDate(day + 1);
    dispatch(
      push(
        `/daily-record/${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()}`
      )
    );
  }, [date, day, dispatch]);

  const oneDayAgo = useCallback(() => {
    date.setDate(day - 1);
    dispatch(
      push(
        `/daily-record/${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()}`
      )
    );
  }, [date, day, dispatch]);

  return (
    <div className={classes.dateSwitch}>
      <ArrowBackIosIcon
        className={`${classes.switch} pointer-h`}
        onClick={oneDayAgo}
      />
      <h2 className={classes.date}>{`${year}-${month}-${day}`}</h2>
      <ArrowForwardIosIcon
        className={`${classes.switch} pointer-h`}
        onClick={oneDayLater}
      />
    </div>
  );
};

export default DateSwitch;
