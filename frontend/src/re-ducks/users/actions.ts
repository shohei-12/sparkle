import { UserState, UserUpdate } from "./types";

export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState: UserState) => {
  return {
    type: "SIGN_IN",
    payload: {
      ...userState,
    },
  };
};

export const SIGN_OUT = "SIGN_OUT";
export const signOutAction = () => {
  return {
    type: "SIGN_OUT",
    payload: {
      isSignedIn: false,
      id: "",
      name: "",
      email: "",
    },
  };
};

export const USER_UPDATE = "USER_UPDATE";
export const updateUserAction = (data: UserUpdate) => {
  return {
    type: "USER_UPDATE",
    payload: {
      ...data,
    },
  };
};
