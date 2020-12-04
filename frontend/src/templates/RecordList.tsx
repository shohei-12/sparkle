import React, { useState, useEffect } from "react";
import axios from "axios";
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

  useEffect(() => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/records`,
    })
      .then((res) => {
        setRecords(res.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  return (
    <div className="wrap">
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
    </div>
  );
};

export default RecordList;
