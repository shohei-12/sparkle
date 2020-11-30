import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import { flashAction } from "../re-ducks/flash/actions";
import { Store } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { ImageField, SecondaryButton } from "../components/UIkit";
import { baseURL } from "../config";

const DailyRecord: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const uid = getUserId(selector);
  const year = Number(window.location.pathname.split("/")[2]);
  const month = Number(window.location.pathname.split("/")[3]);
  const day = Number(window.location.pathname.split("/")[4]);

  const [appearances, setAppearances] = useState<File[]>([]);
  const [breakfasts, setBreakfasts] = useState<File[]>([]);
  const [lunchs, setLunchs] = useState<File[]>([]);
  const [dinners, setDinners] = useState<File[]>([]);
  const [snacks, setSnacks] = useState<File[]>([]);

  const createRecord = useCallback(() => {
    axios({
      method: "POST",
      url: `${baseURL}/api/v1/records`,
      data: {
        id: uid,
        date: new Date(year, month - 1, day + 1),
      },
    })
      .then(async (res) => {
        const recordId = String(res.data.id);
        const data = new FormData();
        data.append("record_id", recordId);
        for (const ele of appearances) {
          data.append("image", ele);
          await axios
            .post(`${baseURL}api/v1/appearances`, data, {
              headers: {
                "content-type": "multipart/form-data",
              },
            })
            .then(() => {
              data.delete("image");
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
        data.append("eating_time_id", "1");
        for (const ele of breakfasts) {
          data.append("image", ele);
          await axios
            .post(`${baseURL}/api/v1/meals`, data, {
              headers: {
                "content-type": "multipart/form-data",
              },
            })
            .then(() => {
              data.delete("image");
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
        data.delete("eating_time_id");
        data.append("eating_time_id", "2");
        for (const ele of lunchs) {
          data.append("image", ele);
          await axios
            .post(`${baseURL}/api/v1/meals`, data, {
              headers: {
                "content-type": "multipart/form-data",
              },
            })
            .then(() => {
              data.delete("image");
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
        data.delete("eating_time_id");
        data.append("eating_time_id", "3");
        for (const ele of dinners) {
          data.append("image", ele);
          await axios
            .post(`${baseURL}/api/v1/meals`, data, {
              headers: {
                "content-type": "multipart/form-data",
              },
            })
            .then(() => {
              data.delete("image");
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
        data.delete("eating_time_id");
        data.append("eating_time_id", "4");
        for (const ele of snacks) {
          data.append("image", ele);
          await axios
            .post(`${baseURL}/api/v1/meals`, data, {
              headers: {
                "content-type": "multipart/form-data",
              },
            })
            .then(() => {
              data.delete("image");
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
        dispatch(flashAction({ type: "success", msg: "記録しました！" }));
        dispatch(push("/user/details"));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [
    uid,
    year,
    month,
    day,
    appearances,
    breakfasts,
    lunchs,
    dinners,
    snacks,
    dispatch,
  ]);

  return (
    <div className="wrap">
      <h2>{`${year}年${month}月${day}日の記録`}</h2>
      <ImageField
        text="見た目を記録する（最大5枚）"
        sheets={4}
        profile={false}
        setAppearances={setAppearances}
      />
      <ImageField
        text="朝食を記録する（最大3枚）"
        sheets={2}
        profile={false}
        setBreakfasts={setBreakfasts}
      />
      <ImageField
        text="昼食を記録する（最大3枚）"
        sheets={2}
        profile={false}
        setLunchs={setLunchs}
      />
      <ImageField
        text="夕食を記録する（最大3枚）"
        sheets={2}
        profile={false}
        setDinners={setDinners}
      />
      <ImageField
        text="間食を記録する（最大3枚）"
        sheets={2}
        profile={false}
        setSnacks={setSnacks}
      />
      <SecondaryButton text="記録する" onClick={createRecord} />
    </div>
  );
};

export default DailyRecord;
