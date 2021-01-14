export type Record = {
  record_id: number;
  date: string;
  appearance: any;
  profile: { url: string | null };
  author: string;
  author_id: number;
  likes: number;
  liking: boolean;
};

export type LikeRecords = {
  uid: number;
  records: Record[];
  start: number;
};

export type Target = "appearance" | "breakfast" | "lunch" | "dinner" | "snack";

export type Comment = {
  comment_id: number;
  author_id: number;
  author_profile: {
    url: string | null;
  };
  author_name: string;
  content: string;
  created_at: string;
};

export type RecordState = {
  records: Record[];
  start: number;
  like_records: LikeRecords[];
};

export type RecordAction = {
  type: string;
  payload?: any;
};
