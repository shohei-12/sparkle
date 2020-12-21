import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "./config";
import { RecordRegistration, RecordDetails } from "./templates";
import { DateSwitch } from "./components/Record";

const Record: React.FC = () => {
  const uid = Number(window.location.pathname.split("/")[2]);
  const year = Number(window.location.pathname.split("/")[3]);
  const month = Number(window.location.pathname.split("/")[4]);
  const day = Number(window.location.pathname.split("/")[5]);
  const date = new Date(year, month - 1, day);

  const [recordId, setRecordId] = useState<number | null>(null);
  const [recordRegistration, setRecordRegistration] = useState(false);

  useEffect(() => {
    if (window.location.pathname === `/record/${uid}/${year}/${month}/${day}`) {
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
          } else {
            setRecordId(null);
            setRecordRegistration(true);
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [uid, year, month, day]);

  if (recordId) {
    return (
      <>
        <DateSwitch uid={uid} date={date} />
        <RecordDetails recordId={recordId} />
      </>
    );
  } else if (recordRegistration) {
    return (
      <>
        <DateSwitch uid={uid} date={date} />
        <RecordRegistration />
      </>
    );
  } else {
    return <></>;
  }
};

export default Record;
