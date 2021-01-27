import React, { useState, useCallback } from "react";
import axios from "axios";
import { TextInput, SecondaryButton } from "../UIkit";
import { Target, Comment } from "../../re-ducks/records/types";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { baseURL } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroup: {
      textAlign: "right",
    },
    marginRight: {
      marginRight: 10,
    },
  })
);

type Props = {
  recordId: number;
  target: Target;
  commentId: number;
  setCommentId: React.Dispatch<React.SetStateAction<number>>;
  replyComments: Comment[];
  setReplyComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  commentList: Comment[];
  commentListIndex: number;
  userId: number | null;
};

const ReplyCommentForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const recordId = props.recordId;
  const target = props.target;
  const commentId = props.commentId;
  const setCommentId = props.setCommentId;
  const replyComments = props.replyComments;
  const setReplyComments = props.setReplyComments;
  const commentList = props.commentList;
  const commentListIndex = props.commentListIndex;
  const userId = props.userId;

  const [reply, setReply] = useState("");

  const inputReply = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReply(e.target.value);
  }, []);

  const cancelReply = useCallback(() => {
    setCommentId(0);
  }, [setCommentId]);

  const replyComment = useCallback(() => {
    axios
      .post(`${baseURL}/api/v1/comments`, {
        record_id: recordId,
        target,
        content: reply,
        reply_comment_id: commentId,
        reply_user_id: userId,
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      })
      .then((res) => {
        setCommentId(0);
        commentList[commentListIndex].reply_count++;
        setReplyComments([...replyComments, ...res.data]);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [
    recordId,
    target,
    reply,
    commentId,
    replyComments,
    setReplyComments,
    commentList,
    commentListIndex,
    userId,
    setCommentId,
  ]);

  return (
    <>
      <TextInput
        fullWidth={true}
        label="返信する"
        multiline={true}
        required={false}
        rows="1"
        type="text"
        name="reply-comment"
        value={reply}
        rowsMax={4}
        onChange={inputReply}
      />
      <div className="space-m"></div>
      <div className={classes.buttonGroup}>
        <Button
          classes={{
            root: classes.marginRight,
          }}
          variant="contained"
          onClick={cancelReply}
        >
          キャンセル
        </Button>
        <SecondaryButton
          text="返信"
          disabled={reply ? false : true}
          onClick={replyComment}
        />
      </div>
    </>
  );
};

export default ReplyCommentForm;
