import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
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
      color: "rgba(0, 0, 0, 0.54)",
    },
  })
);

type Target = "appearance" | "breakfast" | "lunch" | "dinner" | "snack";

type Comment = {
  comment_id: number;
  author_id: number;
  author_profile: {
    url: string | null;
  };
  author_name: string;
  content: string;
  created_at: string;
};

type Props = {
  recordId: number;
  target: Target;
};

const CommentList: React.FC<Props> = React.memo((props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const recordId = props.recordId;
  const target = props.target;

  const [comments, setComments] = useState<Comment[]>([]);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
        setComments([...comments, ...twentyComments]);
        setStart(start + 20);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [recordId, target, start, comments]);

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
        {comments.length > 0 &&
          comments.map((ele, i) => (
            <div key={i} className={classes.comment}>
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
              </div>
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
});

export default CommentList;
