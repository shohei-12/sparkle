import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { getUserName, getUserEmail } from "../re-ducks/users/selectors";
import { Store } from "../re-ducks/store/types";
import { updateUserAction } from "../re-ducks/users/actions";

type Inputs = {
  name: string;
  email: string;
};

const UserEdit: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const uname = getUserName(selector);
  const uemail = getUserEmail(selector);

  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      name: uname,
      email: uemail,
    },
  });

  const [name, setName] = useState(uname);
  const [email, setEmail] = useState(uemail);
  const [duplicateEmail, setDuplicateEmail] = useState("");

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

  const updateUser = () => {
    axios({
      method: "PUT",
      url: "http://localhost:80/api/v1/auth",
      data: {
        name,
        email,
      },
      params: {
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then(() => {
        localStorage.setItem("uid", email);
        dispatch(updateUserAction({ name, email }));
      })
      .catch((error) => {
        const errorData = error.response.data;
        if (
          errorData.errors.full_messages.includes(
            "Email has already been taken"
          )
        ) {
          setDuplicateEmail(email);
        }
      });
  };

  return (
    <div className="wrap">
      <h2>ユーザー編集</h2>
      <TextInput
        fullWidth={true}
        label="ユーザー名（20文字以内）"
        multiline={false}
        required={true}
        rows="1"
        type="text"
        name="name"
        inputRef={register({
          required: "入力必須です。",
          maxLength: {
            value: 20,
            message: "20文字以内で入力してください。",
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
          maxLength: {
            value: 256,
            message: "256文字以内で入力してください。",
          },
          pattern: {
            value: /^[\w+.-]+@[a-z\d.-]+\.[a-z]+$/i,
            message: "メールアドレスの形式が正しくありません。",
          },
          validate: (value) =>
            value !== duplicateEmail ||
            "このメールアドレスはすでに存在します。",
        })}
        error={
          Boolean(errors.email) ||
          (Boolean(duplicateEmail) && email === duplicateEmail)
        }
        helperText={
          (errors.email && errors.email.message) ||
          (duplicateEmail &&
            email === duplicateEmail &&
            "このメールアドレスはすでに存在します。")
        }
        onChange={inputEmail}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="更新する"
        disabled={name && email ? false : true}
        onClick={handleSubmit(updateUser)}
      />
    </div>
  );
};

export default UserEdit;
