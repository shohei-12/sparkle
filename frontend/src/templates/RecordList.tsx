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
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { baseURL } from "../config";
import NoImage from "../assets/img/no-image.png";
import NoProfile from "../assets/img/no-profile.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    record: {
      display: "inline-block",
      margin: 8,
      [theme.breakpoints.up("xs")]: {
        width: "100%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "calc(50% - 16px)",
      },
      [theme.breakpoints.up("lg")]: {
        width: "calc(33.3333% - 16px)",
      },
      [theme.breakpoints.up("xl")]: {
        width: "calc(25% - 16px)",
      },
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    loader: {
      margin: "0 auto",
    },
  })
);

type Record = {
  date: string;
  appearance: { url: string | null };
  profile: { url: string | null };
  author: string;
  author_id: number;
};

const RecordList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState<Record[]>([]);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getRecords = useCallback(() => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/records`,
      params: {
        start,
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
              {ele.appearance.url ? (
                <CardMedia
                  className={classes.media}
                  image={baseURL + ele.appearance.url}
                />
              ) : (
                <CardMedia className={classes.media} image={NoImage} />
              )}
              <CardContent>{ele.date}</CardContent>
              <CardActions>
                <IconButton aria-label="いいね">
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
      </InfiniteScroll>
    </>
  );
};

export default RecordList;
