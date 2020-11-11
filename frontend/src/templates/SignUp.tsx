import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { SecondaryButton, TextInput } from "../components/UIkit";

type Inputs = {
  name: string;
  email: string;
};

const SignUp: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const inputName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [setName]
  );

  const inputEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  const signUp = () => {
    axios({
      method: "POST",
      url: "http://localhost:80/users",
      data: { name: name, email: email },
    })
      .then(() => {})
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <div className="wrap">
      <h2>新規ユーザー登録</h2>
      <TextInput
        fullWidth={true}
        label="ユーザー名"
        multiline={false}
        required={true}
        rows="1"
        type="text"
        name="name"
        inputRef={register({
          required: "入力必須です。",
          maxLength: {
            value: 10,
            message: "10文字以内で入力してください。",
          },
        })}
        error={Boolean(errors.name)}
        helperText={errors.name && errors.name.message}
        onChange={inputName}
      />
      <TextInput
        fullWidth={true}
        label="メールアドレス"
        multiline={false}
        required={true}
        rows="1"
        type="email"
        name="email"
        inputRef={register({
          required: "入力必須です。",
          pattern: {
            value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
            message: "メールアドレスの形式が正しくありません。",
          },
        })}
        error={Boolean(errors.email)}
        helperText={errors.email && errors.email.message}
        onChange={inputEmail}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="登録する"
        disabled={name && email ? false : true}
        onClick={handleSubmit(() => signUp())}
      />
    </div>
  );
};

export default SignUp;
