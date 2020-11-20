import { UserState } from "../users/types";
import { FlashState } from "../flash/types";

export type Store = {
  users: UserState;
  flash: FlashState;
};
