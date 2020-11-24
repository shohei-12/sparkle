import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import {
  getUserName,
  getUserEmail,
  getUserProfile,
} from "../re-ducks/users/selectors";
import { Store } from "../re-ducks/store/types";
import { SecondaryButton } from "../components/UIkit";

const UserDetails = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const name = getUserName(selector);
  const email = getUserEmail(selector);
  const profile = getUserProfile(selector);

  const goUserEditPage = useCallback(() => {
    dispatch(push("/user/edit"));
  }, [dispatch]);

  return (
    <div className="wrap">
      <h2>My Page</h2>
      <img src={profile} alt="プロフィール画像" />
      <span>{name}</span>
      <span>{email}</span>
      <SecondaryButton text="ユーザー情報を編集する" onClick={goUserEditPage} />
    </div>
  );
};

export default UserDetails;
