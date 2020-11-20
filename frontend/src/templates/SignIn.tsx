import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { signIn } from "../re-ducks/users/operations";

const SignIn: React.FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        onClick={() => dispatch(signIn(email, password))}
      />
    </div>
  );
};

export default SignIn;
