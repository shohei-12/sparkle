import { UserState } from "../users/types";
import { RecordState } from "../records/types";
import { FlashState } from "../flash/types";

const initialUserState: UserState = {
  isSignedIn: false,
  id: "",
  name: "",
  email: "",
  profile: "",
  theme: "light",
  tabIndex: 0,
};

const initialRecordState: RecordState = {
  records: [],
  start: 0,
  like_records: [],
};

const initialFlashState: FlashState = {
  type: "",
  msg: "",
};

export const initialState = {
  users: initialUserState,
  records: initialRecordState,
  flash: initialFlashState,
};
