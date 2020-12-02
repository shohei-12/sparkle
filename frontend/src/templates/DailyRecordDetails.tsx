import React, { useEffect } from "react";
import axios from "axios";

type Props = {
  recordId: number;
  recordDate: string;
};

const DailyRecordDetails: React.FC<Props> = (props) => {
  useEffect(() => {}, []);

  return (
    <div>
      <h1>詳細</h1>
      <p>{props.recordDate}</p>
    </div>
  );
};

export default DailyRecordDetails;
