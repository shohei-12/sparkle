import React, { useState, useCallback } from "react";
import axios from "axios";
import { TextInput, SecondaryButton } from "../UIkit";
import { Target, Comment } from "../../re-ducks/records/types";
import { baseURL } from "../../config";

type Props = {
  recordId: number;
  target: Target;
  commentList: Comment[];
  setCommentList: React.Dispatch<React.SetStateAction<Comment[]>>;
};

const CommentForm: React.FC<Props> = React.memo((props) => {
  const recordId = props.recordId;
  const target = props.target;
  const commentList = props.commentList;
  const setCommentList = props.setCommentList;

  const [comment, setComment] = useState("");

  const inputComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

  const createComment = useCallback(() => {
    axios
      .post(`${baseURL}/api/v1/comments`, {
        record_id: recordId,
        target,
        content: comment,
        reply_comment_id: null,
        reply_user_id: null,
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      })
      .then((res) => {
        setComment("");
        setCommentList([...res.data, ...commentList]);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [recordId, target, comment, commentList, setCommentList]);

  return (
    <>
      <TextInput
        fullWidth={true}
        label="コメントを書く"
        multiline={true}
        required={false}
        rows="1"
        type="text"
        name="comment"
        value={comment}
        rowsMax={4}
        onChange={inputComment}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="コメント"
        disabled={comment ? false : true}
        onClick={createComment}
      />
    </>
  );
});

export default CommentForm;
