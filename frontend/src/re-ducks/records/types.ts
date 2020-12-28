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

export type RecordState = {
  records: Record[];
  start: number;
  like_records: {
    records: Record[];
    start: number;
  };
};

export type RecordAction = {
  type: string;
  payload?: any;
};
