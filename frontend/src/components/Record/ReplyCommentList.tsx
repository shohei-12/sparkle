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
    deleteIcon: {
      width: 19,
      height: 19,
    },
  })
);

type Props = {
  replyComments: Comment[];
  setReplyComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  commentListIndex: number;
  deleteComment: (
    id: number,
    replyComment: boolean,
    commentListIndex?: number
  ) => void;
};

const ReplyCommentList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const currentUserId = Number(getUserId(selector));
  const replyComments = props.replyComments;
  const setReplyComments = props.setReplyComments;
  const commentListIndex = props.commentListIndex;
  const deleteComment = props.deleteComment;

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
            <div>
              <span>{ele.author_name}</span>
              <span className={classes.date}>{ele.created_at}</span>
              <p className={classes.content}>{ele.content}</p>
              <div
                className={`${classes.commentTrigger} ${classes.alignItemsCenter}`}
              >
                <span className="pointer-h" onClick={() => console.log("hoge")}>
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
                      <DeleteIcon className={classes.deleteIcon} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ReplyCommentList;
