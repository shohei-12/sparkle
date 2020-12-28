import { Record } from "./types";

export const GET_RECORDS = "GET_RECORDS";
export const getRecordsAction = (records: Record[], start: number) => {
  return {
    type: "GET_RECORDS",
    payload: {
      records,
      start,
    },
  };
};

export const LIKE_OR_UNLIKE_RECORD = "LIKE_OR_UNLIKE_RECORD";
export const likeOrUnlikeRecordAction = () => {
  return {
    type: "LIKE_OR_UNLIKE_RECORD",
  };
};
