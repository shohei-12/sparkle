import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { baseURL } from "../config";

type Record = {
  id: number;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

const RecordList: React.FC = () => {
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
            <CardContent>{ele.date}</CardContent>
          </Card>
        ))}
    </div>
  );
};

export default RecordList;
