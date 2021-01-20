import axios from "axios";
import { push } from "connected-react-router";
import { signInAction, signOutAction, toggleThemeAction } from "./actions";
import { flashAction } from "../flash/actions";
import { baseURL } from "../../config";

const signInAfterSavingToken = (
  dispatch: any,
  responseData: any,
  responseHeaders: any
) => {
  localStorage.setItem("uid", responseHeaders.uid);
  localStorage.setItem("client", responseHeaders.client);
  localStorage.setItem("access_token", responseHeaders.access_token);
  dispatch(
    signInAction({
      isSignedIn: true,
      id: String(responseData.id),
      name: responseData.name,
      email: responseData.email,
      selfIntroduction: responseData.self_introduction,
      profile: responseData.profile.url,
      theme: responseData.theme,
      tabIndex: 0,
    })
  );
  dispatch(push("/"));
};

export const listenAuthState = (tabIndex: number) => {
  return async (dispatch: any) => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/auth/validate_token`,
      params: {
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then((res) => {
        const responseData = res.data.data;
        dispatch(
          signInAction({
            isSignedIn: true,
            id: String(responseData.id),
            name: responseData.name,
            email: responseData.email,
            selfIntroduction: responseData.self_introduction,
            profile: responseData.profile.url,
            theme: responseData.theme,
            tabIndex,
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
      url: `${baseURL}/api/v1/auth/sign_in`,
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        newUser ||
          dispatch(flashAction({ type: "success", msg: "ログインしました！" }));
        const responseData = res.data.data;
        const responseHeaders = res.headers;
        signInAfterSavingToken(dispatch, responseData, responseHeaders);
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

export const signInAsGuestUser = () => {
  return async (dispatch: any) => {
    axios({
      method: "POST",
      url: `${baseURL}/api/v1/auth/sign_in`,
      data: {
        email: "guest@example.com",
        password: "password",
      },
    })
      .then((res) => {
        dispatch(flashAction({ type: "success", msg: "ログインしました！" }));
        const responseData = res.data.data;
        const responseHeaders = res.headers;
        signInAfterSavingToken(dispatch, responseData, responseHeaders);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const signOut = () => {
  return async (dispatch: any) => {
    axios({
      method: "DELETE",
      url: `${baseURL}/api/v1/auth/sign_out`,
      data: {
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
        dispatch(push("/signin"));
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
      url: `${baseURL}/api/v1/auth`,
      data: {
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
        dispatch(push("/signin"));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const toggleTheme = (uid: string, theme: "light" | "dark") => {
  return async (dispatch: any) => {
    axios({
      method: "PUT",
      url: `${baseURL}/api/v1/toggle-theme`,
      data: {
        id: uid,
        theme,
      },
    })
      .then(() => {
        dispatch(
          toggleThemeAction({
            theme,
          })
        );
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};
