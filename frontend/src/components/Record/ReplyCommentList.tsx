import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import { Target, Comment } from "../../re-ducks/records/types";
import { Store } from "../../re-ducks/store/types";
import { getUserId } from "../../re-ducks/users/selectors";
import { ReplyCommentForm } from "../Record";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import Tooltip from "@material-ui/core/Tooltip";
import NoProfile from "../../assets/img/no-profile.png";
import { baseURL } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scrollY: {
      width: "100%",
      height: 200,
      overflowY: "scroll",
    },
    comment: {
      display: "flex",
      marginTop: 30,
    },
    left: {
      marginRight: 20,
    },
    right: {
      width: "100%",
    },
    profile: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      objectFit: "cover",
    },
    content: {
      marginTop: 2,
      marginBottom: 0,
    },
    date: {
      marginLeft: 5,
      color: "#9e9e9e",
    },
    commentTrigger: {
      height: 43,
    },
    alignItemsCenter: {
      display: "flex",
      alignItems: "center",
    },
    otherReply: {
      position: "relative",
      top: -6,
    },
  })
);

type Props = {
  recordId: number;
  target: Target;
  replyComments: Comment[];
  setReplyComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  commentList: Comment[];
  commentListIndex: number;
  deleteComment: (
    id: number,
    replyComment: boolean,
    commentListIndex?: number
  ) => void;
  replyCount: number;
  commentId: number;
};

const ReplyCommentList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const currentUserId = Number(getUserId(selector));
  const recordId = props.recordId;
  const target = props.target;
  const replyComments = props.replyComments;
  const setReplyComments = props.setReplyComments;
  const commentList = props.commentList;
  const commentListIndex = props.commentListIndex;
  const deleteComment = props.deleteComment;
  const commentId = props.commentId;

  const [replyStart, setReplyStart] = useState(10);
  const [replyCount, setReplyCount] = useState(props.replyCount);
  const [replyCommentId, setReplyCommentId] = useState(0);

  const get10ReplyComments = useCallback(
    (id: number) => {
      axios
        .get(`${baseURL}/api/v1/comments/${id}/reply/list`, {
          params: {
            start: replyStart,
          },
        })
        .then((res) => {
          setReplyCount(replyCount - 10);
          setReplyComments([...replyComments, ...res.data]);
          setReplyStart(replyStart + 10);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    [replyStart, replyComments, setReplyComments, replyCount]
  );

  return (
    <>
      {replyComments.map((ele, i) => (
        <div key={i}>
          <div className={classes.comment}>
            <div className={classes.left}>
              <img
                className={`${classes.profile} pointer-h`}
                src={
                  ele.author_profile.url
                    ? baseURL + ele.author_profile.url
                    : NoProfile
                }
                alt="プロフィール画像"
                onClick={() => dispatch(push(`/users/${ele.author_id}`))}
              />
            </div>
            <div className={classes.right}>
              <span>{ele.author_name}</span>
              <span className={classes.date}>{ele.created_at}</span>
              <p className={classes.content}>
                {ele.reply_user_id && ele.reply_user_name && (
                  <span
                    className="link"
                    onClick={() =>
                      dispatch(push(`/users/${ele.reply_user_id}`))
                    }
                  >
                    {`@${ele.reply_user_name}`}{" "}
                  </span>
                )}
                {ele.content}
              </p>
              <div
                className={`${classes.commentTrigger} ${classes.alignItemsCenter}`}
              >
                <span
                  className="pointer-h"
                  onClick={() => setReplyCommentId(ele.comment_id)}
                >
                  返信
                </span>
                {ele.author_id === currentUserId && (
                  <Tooltip title="削除" placement="right">
                    <IconButton
                      aria-label="コメントを削除する"
                      onClick={() =>
                        deleteComment(ele.comment_id, true, commentListIndex)
                      }
                    >
                      <DeleteIcon style={{ fontSize: 19 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              {replyCommentId === ele.comment_id && (
                <ReplyCommentForm
                  recordId={recordId}
                  target={target}
                  commentId={commentId}
                  setCommentId={setReplyCommentId}
                  replyComments={replyComments}
                  setReplyComments={setReplyComments}
                  commentList={commentList}
                  commentListIndex={commentListIndex}
                  userId={ele.author_id}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      {replyCount > 0 && (
        <div
          className="inline-block pointer-h"
          onClick={() => get10ReplyComments(commentId)}
        >
          <SubdirectoryArrowRightIcon />
          <span className={classes.otherReply}>他の返信を表示</span>
        </div>
      )}
    </>
  );
};

export default ReplyCommentList;
