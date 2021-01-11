import React, { useState, useCallback } from "react";
import { TextInput, SecondaryButton } from "../UIkit";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    commentBox: {},
  })
);

const CommentForm: React.FC = () => {
  const classes = useStyles();

  const [comment, setComment] = useState("");

  const inputComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

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
        onChange={inputComment}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="コメント"
        disabled={comment ? false : true}
        onClick={() => console.log("hoge")}
      />
      <div className={classes.commentBox}></div>
    </>
  );
};

export default CommentForm;
