export type User = {
  id: number;
  name: string;
  profile: { url: string | null };
  following: boolean;
};

export type Followings = {
  id: number;
  followings: User[];
  start: number;
};

export type Followers = {
  id: number;
  followers: User[];
  start: number;
};

export type RelationshipState = {
  followings: Followings[];
  followers: Followers[];
};

export type RelationshipAction = {
  type: string;
  payload?: any;
};
