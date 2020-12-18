import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import { flashAction } from "../re-ducks/flash/actions";
import { Store } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { ImageField, SecondaryButton, TextInput } from "../components/UIkit";
import { baseURL } from "../config";

const RecordRegistration: React.FC = () => {
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

  const [appearanceMemo, setAppearanceMemo] = useState("");
  const [breakfastMemo, setBreakfastMemo] = useState("");
  const [lunchMemo, setLunchMemo] = useState("");
  const [dinnerMemo, setDinnerMemo] = useState("");
  const [snackMemo, setSnackMemo] = useState("");

  const inputAppearance = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAppearanceMemo(event.target.value);
    },
    [setAppearanceMemo]
  );

  const inputBreakfast = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBreakfastMemo(event.target.value);
    },
    [setBreakfastMemo]
  );

  const inputLunch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLunchMemo(event.target.value);
    },
    [setLunchMemo]
  );

  const inputDinner = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDinnerMemo(event.target.value);
    },
    [setDinnerMemo]
  );

  const inputSnack = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSnackMemo(event.target.value);
    },
    [setSnackMemo]
  );

  const createRecord = useCallback(() => {
    const data = new FormData();
    data.append("id", uid);
    data.append("date", `${year}-${month}-${day}`);
    data.append("appearance", appearances[0]);
    axios
      .post(`${baseURL}/api/v1/records`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(async (res) => {
        const recordId = String(res.data.id);
        axios({
          method: "POST",
          url: `${baseURL}/api/v1/memos`,
          data: {
            appearance: appearanceMemo,
            breakfast: breakfastMemo,
            lunch: lunchMemo,
            dinner: dinnerMemo,
            snack: snackMemo,
            record_id: recordId,
          },
        }).catch((error) => {
          throw new Error(error);
        });
        const data = new FormData();
        data.append("record_id", recordId);
        for (const ele of appearances) {
          data.append("image", ele);
          await axios
            .post(`${baseURL}/api/v1/appearances`, data, {
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
        const meals = [
          { eating_time_id: "1", meal: breakfasts },
          { eating_time_id: "2", meal: lunchs },
          { eating_time_id: "3", meal: dinners },
          { eating_time_id: "4", meal: snacks },
        ];
        for (const ele of meals) {
          data.append("eating_time_id", ele.eating_time_id);
          for (const meal of ele.meal) {
            data.append("image", meal);
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
    appearanceMemo,
    breakfastMemo,
    lunchMemo,
    dinnerMemo,
    snackMemo,
    dispatch,
  ]);

  return (
    <div className="wrap">
      <ImageField
        text="💪 見た目を記録する（最大5枚）"
        sheets={4}
        profile={false}
        setAppearances={setAppearances}
      />
      <TextInput
        fullWidth={true}
        label="メモ"
        multiline={true}
        required={false}
        rows="5"
        type="text"
        name="appearance"
        onChange={inputAppearance}
      />
      <ImageField
        text="🍙 朝食を記録する（最大3枚）"
        sheets={2}
        profile={false}
        setBreakfasts={setBreakfasts}
      />
      <TextInput
        fullWidth={true}
        label="メモ"
        multiline={true}
        required={false}
        rows="5"
        type="text"
        name="breakfast"
        onChange={inputBreakfast}
      />
      <ImageField
        text="🍔 昼食を記録する（最大3枚）"
        sheets={2}
        profile={false}
        setLunchs={setLunchs}
      />
      <TextInput
        fullWidth={true}
        label="メモ"
        multiline={true}
        required={false}
        rows="5"
        type="text"
        name="lunch"
        onChange={inputLunch}
      />
      <ImageField
        text="🍖 夕食を記録する（最大3枚）"
        sheets={2}
        profile={false}
        setDinners={setDinners}
      />
      <TextInput
        fullWidth={true}
        label="メモ"
        multiline={true}
        required={false}
        rows="5"
        type="text"
        name="dinner"
        onChange={inputDinner}
      />
      <ImageField
        text="🍰 間食を記録する（最大3枚）"
        sheets={2}
        profile={false}
        setSnacks={setSnacks}
      />
      <TextInput
        fullWidth={true}
        label="メモ"
        multiline={true}
        required={false}
        rows="5"
        type="text"
        name="snack"
        onChange={inputSnack}
      />
      <SecondaryButton text="記録する" onClick={createRecord} />
    </div>
  );
};

export default RecordRegistration;
