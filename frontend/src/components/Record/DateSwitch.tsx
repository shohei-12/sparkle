import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dateSwitch: {
      display: 'flex',
      alignItems: 'center',
    },
    date: {
      margin: '0 20px',
    },
    switch: {
      color: theme.palette.secondary.main,
    },
  })
);

type Props = {
  uid: number;
  date: Date;
};

const DateSwitch: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const date = props.date;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const strMonth = ('0' + month).slice(-2);
  const strDay = ('0' + day).slice(-2);

  const oneDayLater = useCallback(() => {
    date.setDate(day + 1);
    dispatch(push(`/record/${props.uid}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`));
  }, [props.uid, date, day, dispatch]);

  const oneDayAgo = useCallback(() => {
    date.setDate(day - 1);
    dispatch(push(`/record/${props.uid}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`));
  }, [props.uid, date, day, dispatch]);

  return (
    <div className={classes.dateSwitch}>
      <ArrowBackIosIcon className={`${classes.switch} pointer-h`} onClick={oneDayAgo} />
      <h2 className={classes.date}>{`${year}-${strMonth}-${strDay}`}</h2>
      <ArrowForwardIosIcon className={`${classes.switch} pointer-h`} onClick={oneDayLater} />
    </div>
  );
};

export default DateSwitch;
