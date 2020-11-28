import { UserState } from "../users/types";
import { FlashState } from "../flash/types";

const initialUserState: UserState = {
  isSignedIn: false,
  id: "",
  name: "",
  email: "",
  profile: "",
  theme: "light",
};

const initialFlashState: FlashState = {
  type: "",
  msg: "",
};

export const initialState = {
  users: initialUserState,
  flash: initialFlashState,
};
