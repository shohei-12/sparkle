import React, { useState, useCallback } from "react";
import axios from "axios";
import { TextInput, SecondaryButton } from "../UIkit";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { baseURL } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentBox: {},
  })
);

type Target = "appearance" | "breakfast" | "lunch" | "dinner" | "snack";

type Props = {
  recordId: number;
  target: Target;
};

const CommentForm: React.FC<Props> = React.memo((props) => {
  const classes = useStyles();
  const recordId = props.recordId;
  const target = props.target;

  const [comment, setComment] = useState("");

  const inputComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

  const createComment = useCallback(() => {
    axios
      .post(`${baseURL}/api/v1/comments`, {
        recordId,
        target,
        content: comment,
        replyCommentId: null,
        replyUserId: null,
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      })
      .then((res) => {
        setComment("");
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [recordId, target, comment]);

  return (
    <>
      <TextInput
        fullWidth={true}
        label="コメントを書く"
        multiline={true}
        required={false}
        rows="3"
        type="text"
        name="comment"
        value={comment}
        onChange={inputComment}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="コメント"
        disabled={comment ? false : true}
        onClick={createComment}
      />
      <div className={classes.commentBox}></div>
    </>
  );
});

export default CommentForm;
