import { Record } from "./types";

export const ADD_RECORDS = "ADD_RECORDS";
export const addRecordsAction = (records: Record[], start: number) => {
  return {
    type: "ADD_RECORDS",
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

export const ADD_LIKE_RECORDS = "ADD_LIKE_RECORDS";
export const addLikeRecordsAction = () => {
  return {
    type: "ADD_LIKE_RECORDS",
  };
};

export const CREATE_LIKE_RECORDS_CONTAINER = "CREATE_LIKE_RECORDS_CONTAINER";
export const createLikeRecordsContainerAction = (uid: number) => {
  return {
    type: "CREATE_LIKE_RECORDS_CONTAINER",
    payload: {
      uid,
      records: [],
      start: 0,
    },
  };
};
