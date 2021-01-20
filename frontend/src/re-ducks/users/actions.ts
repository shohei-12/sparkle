import { UserState, UserUpdate, ThemeToggle } from "./types";

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
      selfIntroduction: "",
      profile: "",
      tabIndex: 0,
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

export const THEME_TOGGLE = "THEME_TOGGLE";
export const toggleThemeAction = (theme: ThemeToggle) => {
  return {
    type: "THEME_TOGGLE",
    payload: {
      ...theme,
    },
  };
};

export const SWITCH_TAB = "SWITCH_TAB";
export const switchTabAction = (tabIndex: number) => {
  return {
    type: "SWITCH_TAB",
    payload: {
      tabIndex,
    },
  };
};
