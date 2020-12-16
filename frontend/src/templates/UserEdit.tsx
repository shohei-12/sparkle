import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import { ImageField, SecondaryButton, TextInput } from "../components/UIkit";
import {
  getUserId,
  getUserName,
  getUserEmail,
  getUserProfile,
} from "../re-ducks/users/selectors";
import { Store } from "../re-ducks/store/types";
import { updateUserAction } from "../re-ducks/users/actions";
import { flashAction } from "../re-ducks/flash/actions";
import NoProfile from "../assets/img/no-profile.png";
import { baseURL } from "../config";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const UserEdit: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const uid = getUserId(selector);
  const uname = getUserName(selector);
  const uemail = getUserEmail(selector);
  const uprofile = getUserProfile(selector);

  const { register, handleSubmit, reset, errors } = useForm<Inputs>({
    mode: "onTouched",
    defaultValues: {
      name: uname,
      email: uemail,
      password: "",
      confirmPassword: "",
    },
  });

  const [profile, setProfile] = useState<File | null>(null);
  const [name, setName] = useState(uname);
  const [email, setEmail] = useState(uemail);
  const [duplicateEmail, setDuplicateEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [differentPassword, setDifferentPassword] = useState(false);

  const inputName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [setName]
  );

  const inputEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  const inputPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [setPassword]
  );

  const inputConfirmPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    },
    [setConfirmPassword]
  );

  const inputCurrentPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentPassword(e.target.value);
    },
    [setCurrentPassword]
  );

  const updateUser = () => {
    if (profile) {
      const data = new FormData();
      data.append("profile", profile);
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      data.append("password_confirmation", confirmPassword);
      data.append("current_password", currentPassword);
      data.append("uid", localStorage.getItem("uid") as string);
      data.append("client", localStorage.getItem("client") as string);
      data.append(
        "access_token",
        localStorage.getItem("access_token") as string
      );
      axios({
        method: "PUT",
        url: `${baseURL}/api/v1/auth`,
        data,
        headers: {
          "content-type": "multipart/form-data",
        },
      })
        .then((res) => {
          const imageURL = res.data.data.profile.url as string;
          password && reset({ password: "", confirmPassword: "" });
          setCurrentPassword("");
          dispatch(
            flashAction({
              type: "success",
              msg: "ユーザー情報を更新しました！",
            })
          );
          localStorage.setItem("uid", email);
          dispatch(updateUserAction({ name, email, profile: imageURL }));
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
          if (
            errorData.errors.full_messages.includes(
              "Current password is invalid"
            )
          ) {
            setDifferentPassword(true);
          }
        });
    }
    axios({
      method: "PUT",
      url: `${baseURL}/api/v1/auth`,
      data: {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        current_password: currentPassword,
      },
      params: {
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then(() => {
        password && reset({ password: "", confirmPassword: "" });
        setCurrentPassword("");
        dispatch(
          flashAction({ type: "success", msg: "ユーザー情報を更新しました！" })
        );
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
        if (
          errorData.errors.full_messages.includes("Current password is invalid")
        ) {
          setDifferentPassword(true);
        }
      });
  };

  return (
    <>
      {uid === "1" && (
        <Alert variant="filled" severity="warning">
          ゲストユーザーはユーザー情報を変更できません！
        </Alert>
      )}
      <h2>ユーザー編集</h2>
      <ImageField
        text="プロフィール画像（任意）"
        sheets={0}
        profile={true}
        uprofile={uprofile ? baseURL + uprofile : NoProfile}
        userEdit={true}
        setProfile={setProfile}
      />
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
        disabled={uid === "1" ? true : false}
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
        disabled={uid === "1" ? true : false}
        onChange={inputEmail}
      />
      <TextInput
        fullWidth={true}
        label="新しいパスワード"
        multiline={false}
        required={false}
        rows="1"
        type="password"
        name="password"
        inputRef={register({
          minLength: {
            value: 6,
            message: "6文字以上で入力してください。",
          },
          pattern: {
            value: /^[\w-]+$/,
            message:
              "半角英数字、ハイフン(-)、アンダーバー(_)のみ利用可能です。",
          },
        })}
        error={Boolean(errors.password)}
        helperText={errors.password && errors.password.message}
        disabled={uid === "1" ? true : false}
        placeholder="パスワードを変更しない場合は空白にしてください"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={inputPassword}
      />
      <TextInput
        fullWidth={true}
        label="新しいパスワード（確認）"
        multiline={false}
        required={false}
        rows="1"
        type="password"
        name="confirmPassword"
        inputRef={register({
          minLength: {
            value: 6,
            message: "6文字以上で入力してください。",
          },
          validate: (value) =>
            value === password || "パスワードが一致しません。",
        })}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword && errors.confirmPassword.message}
        disabled={uid === "1" ? true : false}
        placeholder="パスワードを変更しない場合は空白にしてください"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={inputConfirmPassword}
      />
      <TextInput
        fullWidth={true}
        label="現在のパスワード"
        multiline={false}
        required={true}
        rows="1"
        type="password"
        name="currentPassword"
        error={differentPassword ? true : false}
        helperText={differentPassword ? "パスワードが違います。" : undefined}
        disabled={uid === "1" ? true : false}
        value={currentPassword}
        onChange={inputCurrentPassword}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="更新する"
        disabled={name && email && currentPassword ? false : true}
        onClick={handleSubmit(updateUser)}
      />
    </>
  );
};

export default UserEdit;
