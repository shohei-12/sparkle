import axios from "axios";
import { push } from "connected-react-router";
import { signInAction, signOutAction } from "./actions";
import { flashAction } from "../flash/actions";

export const listenAuthState = () => {
  return async (dispatch: any) => {
    axios({
      method: "GET",
      url: "http://localhost:80/api/v1/auth/validate_token",
      params: {
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        const responseData = response.data.data;
        dispatch(
          signInAction({
            isSignedIn: true,
            id: String(responseData.id),
            name: responseData.name,
            email: responseData.email,
            profile: responseData.profile,
          })
        );
      })
      .catch(() => {
        dispatch(push("/signin"));
      });
  };
};

export const signIn = (email: string, password: string, newUser: boolean) => {
  return async (dispatch: any) => {
    axios({
      method: "POST",
      url: "http://localhost:80/api/v1/auth/sign_in",
      data: {
        email,
        password,
      },
    })
      .then((response) => {
        newUser ||
          dispatch(flashAction({ type: "success", msg: "ログインしました！" }));
        const responseData = response.data.data;
        const responseHeaders = response.headers;
        localStorage.setItem("uid", responseHeaders.uid);
        localStorage.setItem("client", responseHeaders.client);
        localStorage.setItem("access_token", responseHeaders.access_token);
        dispatch(
          signInAction({
            isSignedIn: true,
            id: String(responseData.id),
            name: responseData.name,
            email: responseData.email,
            profile: responseData.profile,
          })
        );
        dispatch(push("/"));
      })
      .catch(() => {
        dispatch(
          flashAction({
            type: "error",
            msg: "入力されたメールアドレスまたはパスワードに誤りがあります。",
          })
        );
      });
  };
};

export const signOut = () => {
  return async (dispatch: any) => {
    axios({
      method: "DELETE",
      url: "http://localhost:80/api/v1/auth/sign_out",
      params: {
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then(() => {
        dispatch(flashAction({ type: "success", msg: "ログアウトしました！" }));
        localStorage.removeItem("uid");
        localStorage.removeItem("client");
        localStorage.removeItem("access_token");
        dispatch(signOutAction());
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const deleteUser = () => {
  return async (dispatch: any) => {
    axios({
      method: "DELETE",
      url: "http://localhost:80/api/v1/auth",
      params: {
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then(() => {
        dispatch(
          flashAction({
            type: "success",
            msg: "アカウントを削除しました。またのご利用をお待ちしております。",
          })
        );
        localStorage.removeItem("uid");
        localStorage.removeItem("client");
        localStorage.removeItem("access_token");
        dispatch(signOutAction());
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};
