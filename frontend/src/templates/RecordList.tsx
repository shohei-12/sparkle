import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Tooltip from "@material-ui/core/Tooltip";
import { baseURL } from "../config";
import NoImage from "../assets/img/no-image.png";
import NoProfile from "../assets/img/no-profile.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    record: {
      display: "inline-block",
      [theme.breakpoints.up("xs")]: {
        width: "100%",
        margin: "8px 0",
      },
      [theme.breakpoints.up("sm")]: {
        width: "calc(50% - 16px)",
        margin: 8,
      },
      [theme.breakpoints.up("lg")]: {
        width: "calc(33.3333% - 16px)",
        margin: 8,
      },
      [theme.breakpoints.up("xl")]: {
        width: "calc(25% - 16px)",
        margin: 8,
      },
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    iconArea: {
      padding: "0 8px 8px",
    },
    unlikeIcon: {
      color: "#f44336",
    },
    loader: {
      margin: "0 auto",
    },
  })
);

type Record = {
  record_id: number;
  date: string;
  appearance: any;
  profile: { url: string | null };
  author: string;
  author_id: number;
  likes: number;
  liking: boolean;
};

const RecordList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState<Record[]>([]);
  // const [likes, setLikes] = useState<number[]>([]);
  // const [liking, setLiking] = useState<boolean[]>([]);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const like = useCallback(
    (recordId: number, i: number) => {
      axios
        .post(`${baseURL}/api/v1/likes`, {
          id: recordId,
          uid: localStorage.getItem("uid"),
          client: localStorage.getItem("client"),
          access_token: localStorage.getItem("access_token"),
        })
        .then(() => {
          const recordsCopy = [...records];
          recordsCopy[i].likes++;
          recordsCopy[i].liking = true;
          setRecords(recordsCopy);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    [records]
  );

  const unlike = useCallback(
    (recordId: number, i: number) => {
      axios
        .delete(`${baseURL}/api/v1/likes/${recordId}`, {
          data: {
            uid: localStorage.getItem("uid"),
            client: localStorage.getItem("client"),
            access_token: localStorage.getItem("access_token"),
          },
        })
        .then(() => {
          const recordsCopy = [...records];
          recordsCopy[i].likes--;
          recordsCopy[i].liking = false;
          setRecords(recordsCopy);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    [records]
  );

  const getRecords = useCallback(() => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/records`,
      params: {
        start,
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then((res) => {
        if (res.data.length === 0) {
          setHasMore(false);
          return;
        }
        setRecords([...records, ...res.data]);
        setStart(start + 20);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [start, records]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/records`,
      params: {
        start,
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      },
    })
      .then((res) => {
        setRecords(res.data);
        setStart(20);
      })
      .catch((error) => {
        throw new Error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <InfiniteScroll
        loadMore={getRecords}
        initialLoad={false}
        hasMore={hasMore}
        threshold={0}
        loader={
          <ReactLoading
            key={0}
            className={classes.loader}
            type="spin"
            color="#03a9f4"
          />
        }
      >
        {records.length > 0 &&
          records.map((ele, i) => (
            <Card key={i} className={classes.record}>
              {ele.profile.url ? (
                <CardHeader
                  avatar={
                    <Avatar>
                      <img
                        className="pointer-h"
                        src={baseURL + ele.profile.url}
                        alt="プロフィール画像"
                        width="40"
                        height="40"
                        onClick={() =>
                          dispatch(push(`/users/${ele.author_id}`))
                        }
                      />
                    </Avatar>
                  }
                  title={ele.author}
                />
              ) : (
                <CardHeader
                  avatar={
                    <Avatar>
                      <img
                        className="pointer-h"
                        src={NoProfile}
                        alt="プロフィール画像"
                        width="40"
                        height="40"
                        onClick={() =>
                          dispatch(push(`/users/${ele.author_id}`))
                        }
                      />
                    </Avatar>
                  }
                  title={ele.author}
                />
              )}
              {ele.appearance ? (
                <CardMedia
                  className={classes.media}
                  image={baseURL + ele.appearance.image.url}
                />
              ) : (
                <CardMedia className={classes.media} image={NoImage} />
              )}
              <CardContent>{ele.date}</CardContent>
              <div className={classes.iconArea}>
                {ele.liking ? (
                  <Tooltip title="いいね解除">
                    <IconButton
                      aria-label="いいね解除"
                      onClick={() => unlike(ele.record_id, i)}
                    >
                      <FavoriteIcon className={classes.unlikeIcon} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="いいね">
                    <IconButton
                      aria-label="いいね"
                      onClick={() => like(ele.record_id, i)}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <span>{ele.likes}</span>
              </div>
            </Card>
          ))}
      </InfiniteScroll>
    </>
  );
};

export default RecordList;
