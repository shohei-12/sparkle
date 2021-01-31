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
  const currentUserId = getUserId(selector);
  const uid = window.location.pathname.split("/")[2];
  const year = Number(window.location.pathname.split("/")[3]);
  const month = Number(window.location.pathname.split("/")[4]);
  const day = Number(window.location.pathname.split("/")[5]);

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
    []
  );

  const inputBreakfast = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBreakfastMemo(event.target.value);
    },
    []
  );

  const inputLunch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLunchMemo(event.target.value);
    },
    []
  );

  const inputDinner = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDinnerMemo(event.target.value);
    },
    []
  );

  const inputSnack = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSnackMemo(event.target.value);
    },
    []
  );

  const createRecord = useCallback(() => {
    axios({
      method: "POST",
      url: `${baseURL}/api/v1/records`,
      data: {
        date: new Date(year, month - 1, day + 1),
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
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
        data.append("id", recordId);
        data.append("uid", localStorage.getItem("uid")!);
        data.append("client", localStorage.getItem("client")!);
        data.append("access_token", localStorage.getItem("access_token")!);
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
          { meal_type: "breakfast", meal: breakfasts },
          { meal_type: "lunch", meal: lunchs },
          { meal_type: "dinner", meal: dinners },
          { meal_type: "snack", meal: snacks },
        ];
        for (const ele of meals) {
          data.append("meal_type", ele.meal_type);
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
          data.delete("meal_type");
        }
        dispatch(flashAction({ type: "success", msg: "記録しました！" }));
        dispatch(push(`/users/${currentUserId}`));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [
    currentUserId,
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
      {currentUserId === uid ? (
        <>
          <ImageField
            text="見た目を記録する（最大5枚）"
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
            text="朝食を記録する（最大3枚）"
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
            text="昼食を記録する（最大3枚）"
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
            text="夕食を記録する（最大3枚）"
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
            text="間食を記録する（最大3枚）"
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
        </>
      ) : (
        <p>記録がありません</p>
      )}
    </div>
  );
};

export default RecordRegistration;
