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

export const NON_PAYLOAD = "NON_PAYLOAD";
export const nonPayloadAction = () => {
  return {
    type: "NON_PAYLOAD",
  };
};
