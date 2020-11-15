export type UserState = {
  isSignedIn: boolean;
  uid: string;
  name: string;
  email: string;
};

export type UserAction = {
  type: string;
  payload: UserState;
};
