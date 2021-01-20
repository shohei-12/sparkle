import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ImageField, SecondaryButton, TextInput } from "../components/UIkit";
import { Store } from "../re-ducks/store/types";
import { getTheme } from "../re-ducks/users/selectors";
import { signIn } from "../re-ducks/users/operations";
import { flashAction } from "../re-ducks/flash/actions";
import { baseURL } from "../config";

type Inputs = {
  name: string;
  email: string;
  selfIntroduction: string;
  password: string;
  confirmPassword: string;
};

const SignUp: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      selfIntroduction: "",
      password: "",
      confirmPassword: "",
    },
  });

  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const theme = getTheme(selector);

  const [profile, setProfile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const inputEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const inputSelfIntroduction = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelfIntroduction(e.target.value);
    },
    []
  );

  const inputPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  const inputConfirmPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    },
    []
  );

  const signUp = () => {
    const data = new FormData();
    profile && data.append("profile", profile);
    data.append("name", name);
    data.append("email", email);
    data.append("self_introduction", selfIntroduction);
    data.append("password", password);
    data.append("password_confirmation", confirmPassword);
    data.append("theme", theme);
    axios
      .post(`${baseURL}/api/v1/auth`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        dispatch(
          flashAction({ type: "success", msg: "アカウントを登録しました！" })
        );
        dispatch(signIn(email, password, true));
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
      <h2>新規ユーザー登録</h2>
      <ImageField
        text="プロフィール画像（任意）"
        sheets={0}
        profile={true}
        signUp={true}
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
      <TextInput
        fullWidth={true}
        label="自己紹介（任意・160文字以内）"
        multiline={true}
        required={false}
        rows="3"
        type="text"
        name="selfIntroduction"
        inputRef={register({
          maxLength: {
            value: 160,
            message: "160文字以内で入力してください。",
          },
        })}
        error={Boolean(errors.selfIntroduction)}
        helperText={errors.selfIntroduction && errors.selfIntroduction.message}
        onChange={inputSelfIntroduction}
      />
      <TextInput
        fullWidth={true}
        label="パスワード（6文字以上）"
        multiline={false}
        required={true}
        rows="1"
        type="password"
        name="password"
        inputRef={register({
          required: "入力必須です。",
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
        onChange={inputPassword}
      />
      <TextInput
        fullWidth={true}
        label="パスワード（確認）"
        multiline={false}
        required={true}
        rows="1"
        type="password"
        name="confirmPassword"
        inputRef={register({
          required: "入力必須です。",
          minLength: {
            value: 6,
            message: "6文字以上で入力してください。",
          },
          validate: (value) =>
            value === password || "パスワードが一致しません。",
        })}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword && errors.confirmPassword.message}
        onChange={inputConfirmPassword}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="登録する"
        disabled={name && email && password && confirmPassword ? false : true}
        onClick={handleSubmit(signUp)}
      />
    </div>
  );
};

export default SignUp;
