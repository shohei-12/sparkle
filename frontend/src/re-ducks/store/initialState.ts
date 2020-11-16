import { UserState } from "../users/types";

const initialUserState: UserState = {
  isSignedIn: false,
  id: "",
  name: "",
  email: "",
};

export const initialState = {
  users: initialUserState,
};
