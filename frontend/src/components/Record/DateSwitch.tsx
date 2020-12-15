import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

type Props = {
  date: Date;
};

const DateSwitch: React.FC<Props> = (props) => {
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
    <div>
      <ArrowBackIosIcon onClick={oneDayAgo} />
      <span>{`${year}-${month}-${day}`}</span>
      <ArrowForwardIosIcon onClick={oneDayLater} />
    </div>
  );
};

export default DateSwitch;
