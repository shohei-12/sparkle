import axios from "axios";
import { likeOrUnlikeRecordAction, addLikeRecordsAction } from "./actions";
import { Record, LikeRecords } from "./types";
import { baseURL } from "../../config";

export const likeRecord = (recordId: number, i: number) => {
  return async (dispatch: any, getState: any) => {
    axios
      .post(`${baseURL}/api/v1/likes`, {
        id: recordId,
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      })
      .then(() => {
        const records = getState().records.records as Record[];
        records[i].likes++;
        records[i].liking = true;
        dispatch(likeOrUnlikeRecordAction());
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const unlikeRecord = (recordId: number, i: number) => {
  return async (dispatch: any, getState: any) => {
    axios
      .delete(`${baseURL}/api/v1/likes/${recordId}`, {
        data: {
          uid: localStorage.getItem("uid"),
          client: localStorage.getItem("client"),
          access_token: localStorage.getItem("access_token"),
        },
      })
      .then(() => {
        const records = getState().records.records as Record[];
        records[i].likes--;
        records[i].liking = false;
        dispatch(likeOrUnlikeRecordAction());
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const addLikeRecords = (
  uid: number,
  twentyLikeRecords: Record[],
  nextStart: number
) => {
  return async (dispatch: any, getState: any) => {
    const likeRecords = getState().records.like_records as LikeRecords[];
    const found = likeRecords.find((ele) => ele.uid === uid)!;
    found.records = [...found.records, ...twentyLikeRecords];
    found.start = nextStart;
    dispatch(addLikeRecordsAction());
  };
};
