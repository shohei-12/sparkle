import { UserState } from "../users/types";

const initialUserState: UserState = {
  isSignedIn: false,
  uid: "",
  name: "",
  email: "",
};

export const initialState = {
  users: initialUserState,
};
