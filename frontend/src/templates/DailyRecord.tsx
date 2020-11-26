import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import { flashAction } from "../re-ducks/flash/actions";
import { Store } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { ImageField, SecondaryButton } from "../components/UIkit";

const DailyRecord: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const uid = getUserId(selector);
  const year = Number(window.location.pathname.split("/")[2]);
  const month = Number(window.location.pathname.split("/")[3]);
  const day = Number(window.location.pathname.split("/")[4]);

  const [images, setImages] = useState<File[]>([]);

  const createRecord = useCallback(() => {
    axios({
      method: "POST",
      url: "http://localhost:80/api/v1/records",
      data: {
        id: uid,
        date: new Date(year, month - 1, day + 1),
      },
    })
      .then(async (res) => {
        const recordId = String(res.data.id);
        const data = new FormData();
        data.append("record_id", recordId);
        for (const ele of images) {
          data.append("image", ele);
          await axios
            .post("http://localhost:80/api/v1/appearances", data, {
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
  }, [uid, year, month, day, images, dispatch]);

  return (
    <div className="wrap">
      <h2>{`${year}年${month}月${day}日の記録`}</h2>
      <ImageField
        text="見た目を記録する（最大5枚）"
        sheets={4}
        profile={false}
        setImages={setImages}
      />
      <ImageField text="朝食を記録する（最大3枚）" sheets={2} profile={false} />
      <ImageField text="昼食を記録する（最大3枚）" sheets={2} profile={false} />
      <ImageField text="夕食を記録する（最大3枚）" sheets={2} profile={false} />
      <ImageField text="間食を記録する（最大3枚）" sheets={2} profile={false} />
      <SecondaryButton text="記録する" onClick={createRecord} />
    </div>
  );
};

export default DailyRecord;
