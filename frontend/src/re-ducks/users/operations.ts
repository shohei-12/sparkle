import axios from "axios";
import { push } from "connected-react-router";
import { signInAction, signOutAction } from "./actions";

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
          })
        );
      })
      .catch(() => {
        dispatch(push("/signin"));
      });
  };
};

export const signIn = (email: string, password: string) => {
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
          })
        );
        dispatch(push("/"));
      })
      .catch(() => {
        alert("入力されたメールアドレスまたはパスワードに誤りがあります。");
      });
  };
};

export const signOut = () => {
  return async (dispatch: any) => {
    axios({
      method: "DELETE",
      url: "http://localhost:80/api/v1/auth/sign_out",
      data: {
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then(() => {
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
