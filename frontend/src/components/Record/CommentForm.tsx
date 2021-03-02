import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { TextInput, SecondaryButton } from '../UIkit';
import { Target, Comment } from '../../re-ducks/records/types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { baseURL } from '../../config';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroup: {
      textAlign: 'right',
    },
    marginRight: {
      marginRight: 10,
    },
  })
);

type Props = {
  recordId: number;
  target: Target;
  commentList: Comment[];
  commentCount: number;
  setCommentList: React.Dispatch<React.SetStateAction<Comment[]>>;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
};

const CommentForm: React.FC<Props> = React.memo((props) => {
  const classes = useStyles();
  const recordId = props.recordId;
  const target = props.target;
  const commentList = props.commentList;
  const commentCount = props.commentCount;
  const setCommentList = props.setCommentList;
  const setCommentCount = props.setCommentCount;

  const [comment, setComment] = useState('');

  const inputComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

  const cancelComment = useCallback(() => {
    setComment('');
  }, []);

  const createComment = useCallback(() => {
    axios
      .post(`${baseURL}/api/v1/comments`, {
        record_id: recordId,
        target,
        content: comment,
        reply_comment_id: null,
        reply_user_id: null,
        uid: localStorage.getItem('uid'),
        client: localStorage.getItem('client'),
        access_token: localStorage.getItem('access_token'),
      })
      .then((res) => {
        setComment('');
        setCommentList([...res.data, ...commentList]);
        setCommentCount(commentCount + 1);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [recordId, target, comment, commentList, setCommentList, setCommentCount, commentCount]);

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
      <div className={classes.buttonGroup}>
        <Button
          classes={{
            root: classes.marginRight,
          }}
          variant="contained"
          onClick={cancelComment}
        >
          キャンセル
        </Button>
        <SecondaryButton text="コメント" disabled={comment ? false : true} onClick={createComment} />
      </div>
    </>
  );
});

export default CommentForm;
