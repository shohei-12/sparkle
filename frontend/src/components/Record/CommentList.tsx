import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import { Target, Comment } from "../../re-ducks/records/types";
import { Store } from "../../re-ducks/store/types";
import { getUserId } from "../../re-ducks/users/selectors";
import { ReplyCommentForm, ReplyCommentList } from "../Record";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import Tooltip from "@material-ui/core/Tooltip";
import NoProfile from "../../assets/img/no-profile.png";
import { baseURL } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    otherComment: {
      position: "relative",
      top: -3,
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

const CommentList: React.FC<Props> = React.memo((props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const currentUserId = Number(getUserId(selector));
  const recordId = props.recordId;
  const target = props.target;
  const commentList = props.commentList;
  const commentCount = props.commentCount;
  const setCommentList = props.setCommentList;
  const setCommentCount = props.setCommentCount;

  const [start, setStart] = useState(0);
  const [commentId, setCommentId] = useState(0);
  const [commentsRemaining, setCommentsRemaining] = useState(commentCount);
  const [openReplyComments, setOpenReplyComments] = useState(0);
  const [replyComments, setReplyComments] = useState<Comment[]>([]);

  const deleteComment = useCallback(
    (id: number, replyComment: boolean, commentListIndex?: number) => {
      if (window.confirm("本当に削除しますか？")) {
        axios
          .delete(`${baseURL}/api/v1/comments/${id}`, {
            data: {
              uid: localStorage.getItem("uid"),
              client: localStorage.getItem("client"),
              access_token: localStorage.getItem("access_token"),
            },
          })
          .then(() => {
            if (replyComment && commentListIndex !== undefined) {
              if (replyComments.length === 1) {
                setOpenReplyComments(0);
              }
              commentList[commentListIndex].reply_count--;
              const result = replyComments.filter(
                (ele) => ele.comment_id !== id
              );
              setReplyComments(result);
            } else {
              const result = commentList.filter((ele) => ele.comment_id !== id);
              setCommentList(result);
              setCommentCount(commentCount - 1);
            }
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    },
    [commentList, setCommentList, replyComments, setCommentCount, commentCount]
  );

  const get10ReplyComments = useCallback((id: number) => {
    axios
      .get(`${baseURL}/api/v1/comments/${id}/reply/list`, {
        params: {
          start: 0,
        },
      })
      .then((res) => {
        setReplyComments(res.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  const get20Comments = useCallback(() => {
    axios
      .get(`${baseURL}/api/v1/comments/${recordId}/${target}`, {
        params: {
          start,
        },
      })
      .then((res) => {
        setCommentsRemaining(commentsRemaining - 20);
        setCommentList([...commentList, ...res.data]);
        setStart(start + 20);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [recordId, target, commentsRemaining, setCommentList, commentList, start]);

  useEffect(() => {
    get20Comments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {commentList.length > 0 &&
        commentList.map((ele, i) => (
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
                <p className={classes.content}>{ele.content}</p>
                <div
                  className={`${classes.commentTrigger} ${classes.alignItemsCenter}`}
                >
                  <span
                    className="pointer-h"
                    onClick={() => setCommentId(ele.comment_id)}
                  >
                    返信
                  </span>
                  {ele.author_id === currentUserId && (
                    <Tooltip title="削除" placement="right">
                      <IconButton
                        aria-label="コメントを削除する"
                        onClick={() => deleteComment(ele.comment_id, false)}
                      >
                        <DeleteIcon style={{ fontSize: 19 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
                {commentId === ele.comment_id && (
                  <ReplyCommentForm
                    recordId={recordId}
                    target={target}
                    commentId={ele.comment_id}
                    setCommentId={setCommentId}
                    replyComments={replyComments}
                    setReplyComments={setReplyComments}
                    commentList={commentList}
                    commentListIndex={i}
                    userId={null}
                  />
                )}
                {ele.reply_count > 0 && openReplyComments !== ele.comment_id && (
                  <div
                    className={`${classes.alignItemsCenter} pointer-h`}
                    onClick={() => {
                      setOpenReplyComments(ele.comment_id);
                      get10ReplyComments(ele.comment_id);
                    }}
                  >
                    <ArrowDropDownIcon />
                    <span>{ele.reply_count}件の返信を表示</span>
                  </div>
                )}
                {ele.reply_count > 0 && openReplyComments === ele.comment_id && (
                  <>
                    <div
                      className={`${classes.alignItemsCenter} pointer-h`}
                      onClick={() => {
                        setOpenReplyComments(0);
                      }}
                    >
                      <ArrowDropUpIcon />
                      <span>{ele.reply_count}件の返信を非表示</span>
                    </div>
                    <ReplyCommentList
                      recordId={recordId}
                      target={target}
                      replyComments={replyComments}
                      setReplyComments={setReplyComments}
                      commentList={commentList}
                      commentListIndex={i}
                      deleteComment={deleteComment}
                      replyCount={ele.reply_count - 10}
                      commentId={ele.comment_id}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      {commentsRemaining > 0 && (
        <div className="inline-block pointer-h" onClick={get20Comments}>
          <SubdirectoryArrowRightIcon />
          <span className={classes.otherComment}>他のコメントを表示</span>
        </div>
      )}
    </>
  );
});

export default CommentList;
