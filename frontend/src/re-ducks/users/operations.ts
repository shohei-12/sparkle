import axios from "axios";
import { push } from "connected-react-router";
import { signInAction } from "./actions";

export const signIn = (email: string, password: string) => {
  return async (dispatch: any) => {
    axios({
      method: "POST",
      url: "http://localhost:80/v1/auth/sign_in",
      data: {
        email,
        password,
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
        dispatch(push("/"));
      })
      .catch(() => {
        alert("入力されたメールアドレスまたはパスワードに誤りがあります。");
      });
  };
};
