import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";
import { Target, Comment } from "../../re-ducks/records/types";
import { Store } from "../../re-ducks/store/types";
import { getUserId } from "../../re-ducks/users/selectors";
import { ReplyCommentForm, ReplyCommentList } from "../Record";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
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
  })
);

type Props = {
  recordId: number;
  target: Target;
  commentList: Comment[];
  setCommentList: React.Dispatch<React.SetStateAction<Comment[]>>;
};

const CommentList: React.FC<Props> = React.memo((props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const currentUserId = Number(getUserId(selector));
  const recordId = props.recordId;
  const target = props.target;
  const commentList = props.commentList;
  const setCommentList = props.setCommentList;

  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [commentId, setCommentId] = useState(0);
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
            if (replyComment && commentListIndex) {
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
            }
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    },
    [commentList, setCommentList, replyComments]
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
        const twentyComments: Comment[] = res.data;
        if (twentyComments.length === 0) {
          setHasMore(false);
          return;
        }
        setCommentList([...commentList, ...twentyComments]);
        setStart(start + 20);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [recordId, target, start, commentList, setCommentList]);

  return (
    <div className={classes.scrollY}>
      <InfiniteScroll
        loadMore={get20Comments}
        hasMore={hasMore}
        threshold={0}
        loader={
          <ReactLoading
            key={0}
            className="loader"
            type="spin"
            color="#03a9f4"
          />
        }
        useWindow={false}
      >
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
                        replyComments={replyComments}
                        setReplyComments={setReplyComments}
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
      </InfiniteScroll>
    </div>
  );
});

export default CommentList;
