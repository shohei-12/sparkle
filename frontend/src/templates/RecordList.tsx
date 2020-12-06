import React, { useState, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { baseURL } from "../config";
import NoImage from "../assets/img/no-image.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  id: number;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  appearance: { url: string | null };
};

const RecordList: React.FC = () => {
  const classes = useStyles();
  const [records, setRecords] = useState<Record[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getRecords = useCallback(() => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/records`,
      params: {
        page,
      },
    })
      .then((res) => {
        if (res.data.length === 0) {
          setHasMore(false);
          return;
        }
        setRecords([...records, ...res.data]);
        setPage(page + 1);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [page, records]);

  return (
    <div className="wrap">
      <InfiniteScroll
        loadMore={getRecords}
        initialLoad={true}
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
            <Card key={i}>
              <CardHeader title="record" />
              {ele.appearance.url ? (
                <CardMedia
                  className={classes.media}
                  image={baseURL + ele.appearance.url}
                />
              ) : (
                <CardMedia className={classes.media} image={NoImage} />
              )}
              <CardContent>{ele.date}</CardContent>
            </Card>
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default RecordList;
