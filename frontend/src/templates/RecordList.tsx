import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";
import { likeRecord, unlikeRecord } from "../re-ducks/records/operations";
import { getRecordsAction } from "../re-ducks/records/actions";
import { getRecords, getStart } from "../re-ducks/records/selectors";
import { Record } from "../re-ducks/records/types";
import { Store } from "../re-ducks/store/types";
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
    profile: {
      width: 40,
      height: 40,
      objectFit: "cover",
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    cardContent: {
      display: "inline-block",
      padding: 0,
      margin: 16,
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

const RecordList: React.FC = () => {
  const classes = useStyles();
  const selector = useSelector((state: Store) => state);
  const records = getRecords(selector);
  const start = getStart(selector);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);

  const goRecordDetailsPage = useCallback(
    (author_id: number, dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dispatch(push(`/record/${author_id}/${year}/${month}/${day}`));
    },
    [dispatch]
  );

  const get20Records = useCallback(() => {
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
        const twentyRecordsData: Record[] = res.data;
        if (twentyRecordsData.length === 0) {
          setHasMore(false);
          return;
        }
        const nextStart = start + 20;
        dispatch(getRecordsAction(twentyRecordsData, nextStart));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [start, dispatch]);

  return (
    <>
      <InfiniteScroll
        loadMore={get20Records}
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
                        className={`${classes.profile} pointer-h`}
                        src={baseURL + ele.profile.url}
                        alt="プロフィール画像"
                        onClick={() =>
                          dispatch(push(`/users/${ele.author_id}`))
                        }
                      />
                    </Avatar>
                  }
                  title={ele.author}
                  subheader={ele.date}
                />
              ) : (
                <CardHeader
                  avatar={
                    <Avatar>
                      <img
                        className={`${classes.profile} pointer-h`}
                        src={NoProfile}
                        alt="プロフィール画像"
                        onClick={() =>
                          dispatch(push(`/users/${ele.author_id}`))
                        }
                      />
                    </Avatar>
                  }
                  title={ele.author}
                  subheader={ele.date}
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
              <CardContent
                className={`${classes.cardContent} pointer-h`}
                onClick={() => goRecordDetailsPage(ele.author_id, ele.date)}
              >
                詳細を見る
              </CardContent>
              <div className={classes.iconArea}>
                {ele.liking ? (
                  <Tooltip title="いいね解除">
                    <IconButton
                      aria-label="いいね解除"
                      onClick={() => dispatch(unlikeRecord(ele.record_id, i))}
                    >
                      <FavoriteIcon className={classes.unlikeIcon} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="いいね">
                    <IconButton
                      aria-label="いいね"
                      onClick={() => dispatch(likeRecord(ele.record_id, i))}
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
