import { UserState } from '../users/types';
import { RecordState } from '../records/types';
import { RelationshipState } from '../relationships/types';
import { FlashState } from '../flash/types';

const initialUserState: UserState = {
  isSignedIn: false,
  id: '',
  name: '',
  email: '',
  selfIntroduction: '',
  profile: '',
  theme: 'light',
  tabIndex: 0,
};

const initialRecordState: RecordState = {
  records: [],
  start: 0,
  like_records: [],
};

const initialRelationshipState: RelationshipState = {
  followings: [],
  followers: [],
};

const initialFlashState: FlashState = {
  type: '',
  msg: '',
};

export const initialState = {
  users: initialUserState,
  records: initialRecordState,
  relationships: initialRelationshipState,
  flash: initialFlashState,
};
