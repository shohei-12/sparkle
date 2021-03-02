import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SecondaryButton, TextInput } from '../components/UIkit';
import { signIn, signInAsGuestUser } from '../re-ducks/users/operations';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    easyLogin: {
      backgroundColor: '#ff80ab',
      '&:hover': {
        backgroundColor: 'rgb(178, 89, 119)',
      },
    },
  })
);

const SignIn: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  const inputPassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );

  const dispatchSignInAsGuestUser = useCallback(() => {
    dispatch(signInAsGuestUser());
  }, [dispatch]);

  return (
    <div className="wrap">
      <h2>ログイン</h2>
      <TextInput
        fullWidth={true}
        label="メールアドレス"
        multiline={false}
        required={true}
        rows="1"
        type="email"
        name="email"
        onChange={inputEmail}
      />
      <TextInput
        fullWidth={true}
        label="パスワード"
        multiline={false}
        required={true}
        rows="1"
        type="password"
        name="password"
        onChange={inputPassword}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="ログインする"
        disabled={email && password ? false : true}
        onClick={() => dispatch(signIn(email, password, false))}
      />
      <div className="space-m"></div>
      <Button
        className={classes.easyLogin}
        variant="contained"
        onClick={dispatchSignInAsGuestUser}
      >
        ゲストユーザーでログインする
      </Button>
    </div>
  );
};

export default SignIn;
