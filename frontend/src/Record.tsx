import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Store } from "./re-ducks/store/types";
import { getUserId } from "./re-ducks/users/selectors";
import { baseURL } from "./config";
import { RecordRegistration, RecordDetails } from "./templates";
import { DateSwitch } from "./components/Record";

const Record: React.FC = () => {
  const selector = useSelector((state: Store) => state);
  const uid = getUserId(selector);
  const year = Number(window.location.pathname.split("/")[2]);
  const month = Number(window.location.pathname.split("/")[3]);
  const day = Number(window.location.pathname.split("/")[4]);
  const date = new Date(year, month - 1, day);

  const [recordId, setRecordId] = useState<number | null>(null);
  const [recordDate, setRecordDate] = useState<string | null>(null);
  const [recordRegistration, setRecordRegistration] = useState(false);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/record`,
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
          setRecordId(null);
          setRecordDate(null);
          setRecordRegistration(true);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [uid, year, month, day]);

  if (recordId && recordDate) {
    return (
      <>
        <DateSwitch date={date} />
        <RecordDetails recordId={recordId} recordDate={recordDate} />
      </>
    );
  } else if (recordRegistration) {
    return (
      <>
        <DateSwitch date={date} />
        <RecordRegistration />
      </>
    );
  } else {
    return <></>;
  }
};

export default Record;
