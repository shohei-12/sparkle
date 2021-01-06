export type User = {
  id: number;
  name: string;
  profile: { url: string | null };
  following: boolean;
};

export type Followings = {
  id: number;
  followings: User[];
};

export type Followers = {
  id: number;
  followers: User[];
};

export type RelationshipState = {
  followings: Followings[];
  followers: Followers[];
};
