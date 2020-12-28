import { UserState } from "../users/types";
import { RecordState } from "../records/types";
import { FlashState } from "../flash/types";

export type Store = {
  users: UserState;
  records: RecordState;
  flash: FlashState;
};
