import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backToTopButton: {
      position: 'fixed',
      right: 30,
      bottom: 30,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: 60,
      height: 60,
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      borderRadius: '50%',
      transition: 'all 0.3s',
      '&:hover': {
        cursor: 'pointer',
        transform: 'scale(1.1)',
      },
    },
    icon: {
      position: 'relative',
      top: 6,
      '& > svg': {
        width: 35,
        height: 35,
      },
    },
    buttonText: {
      position: 'relative',
      top: -8,
    },
  })
);

const BackToTopButton: React.FC = () => {
  const classes = useStyles();

  return (
    // eslint-disable-next-line no-restricted-globals
    <div className={classes.backToTopButton} onClick={() => scrollTo(0, 0)}>
      <div className={classes.icon}>
        <KeyboardArrowUpIcon />
      </div>
      <span className={classes.buttonText}>TOP</span>
    </div>
  );
};

export default BackToTopButton;
