export type UserState = {
  isSignedIn: boolean;
  id: string;
  name: string;
  email: string;
};

export type UserUpdate = {
  name: string;
  email: string;
};

export type UserAction = {
  type: string;
  payload: UserState;
};
