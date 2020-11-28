export type UserState = {
  isSignedIn: boolean;
  id: string;
  name: string;
  email: string;
  profile: string;
  theme: "light" | "dark";
};

export type UserUpdate = {
  name: string;
  email: string;
};

export type ThemeToggle = {
  theme: "light" | "dark";
};

export type UserAction = {
  type: string;
  payload: any;
};
