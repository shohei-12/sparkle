import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Store } from "./re-ducks/store/types";
import { getUserId } from "./re-ducks/users/selectors";
import { baseURL } from "./config";
import { DailyRecordRegistration, DailyRecordDetails } from "./templates";

const DailyRecord: React.FC = () => {
  const selector = useSelector((state: Store) => state);
  const uid = getUserId(selector);
  const year = Number(window.location.pathname.split("/")[2]);
  const month = Number(window.location.pathname.split("/")[3]);
  const day = Number(window.location.pathname.split("/")[4]);

  const [recordId, setRecordId] = useState<number | null>(null);
  const [recordDate, setRecordDate] = useState<string | null>(null);
  const [recordRegistration, setRecordRegistration] = useState(false);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/records`,
      params: {
        id: uid,
        date: new Date(year, month - 1, day + 1),
      },
    })
      .then((res) => {
        if (res.data) {
          setRecordId(res.data.id);
          setRecordDate(res.data.date);
        } else {
          setRecordRegistration(true);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (recordId && recordDate) {
    return <DailyRecordDetails recordId={recordId} recordDate={recordDate} />;
  } else if (recordRegistration) {
    return <DailyRecordRegistration />;
  } else {
    return <></>;
  }
};

export default DailyRecord;
