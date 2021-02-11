import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { push } from "connected-react-router";
import { flashAction } from "../re-ducks/flash/actions";
import { Store } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { ImageField, SecondaryButton, TextInput } from "../components/UIkit";
import { baseURL } from "../config";

const RecordEdit: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const currentUserId = getUserId(selector);
  const uid = window.location.pathname.split("/")[2];
  const year = Number(window.location.pathname.split("/")[3]);
  const month = Number(window.location.pathname.split("/")[4]);
  const day = Number(window.location.pathname.split("/")[5]);

  const [recordId, setRecordId] = useState("");

  const [appearancesId, setAppearancesId] = useState<number[]>([]);
  const [mealsId, setMealsId] = useState<number[]>([]);

  const [appearances, setAppearances] = useState<File[]>([]);
  const [breakfasts, setBreakfasts] = useState<File[]>([]);
  const [lunchs, setLunchs] = useState<File[]>([]);
  const [dinners, setDinners] = useState<File[]>([]);
  const [snacks, setSnacks] = useState<File[]>([]);

  const [appearancePath, setAppearancePath] = useState<[number, string][]>([]);
  const [breakfastPath, setBreakfastPath] = useState<[number, string][]>([]);
  const [lunchPath, setLunchPath] = useState<[number, string][]>([]);
  const [dinnerPath, setDinnerPath] = useState<[number, string][]>([]);
  const [snackPath, setSnackPath] = useState<[number, string][]>([]);

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

  const updateRecord = useCallback(async () => {
    await axios
      .delete(`${baseURL}/api/v1/records/images/delete`, {
        data: {
          appearances: appearancesId,
          meals: mealsId,
          uid: localStorage.getItem("uid"),
          client: localStorage.getItem("client"),
          access_token: localStorage.getItem("access_token"),
        },
      })
      .catch((error) => {
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
    axios
      .put(`${baseURL}/api/v1/memos/${recordId}`, {
        appearance: appearanceMemo,
        breakfast: breakfastMemo,
        lunch: lunchMemo,
        dinner: dinnerMemo,
        snack: snackMemo,
        uid: localStorage.getItem("uid"),
        client: localStorage.getItem("client"),
        access_token: localStorage.getItem("access_token"),
      })
      .catch((error) => {
        throw new Error(error);
      });
    dispatch(flashAction({ type: "success", msg: "更新しました！" }));
    dispatch(push(`/record/${currentUserId}/${year}/${month}/${day}`));
  }, [
    recordId,
    appearances,
    breakfasts,
    lunchs,
    dinners,
    snacks,
    dispatch,
    appearancesId,
    mealsId,
    currentUserId,
    year,
    month,
    day,
    appearanceMemo,
    breakfastMemo,
    lunchMemo,
    dinnerMemo,
    snackMemo,
  ]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/records/related`, {
        params: {
          date: new Date(year, month - 1, day + 1),
          uid: localStorage.getItem("uid"),
          client: localStorage.getItem("client"),
          access_token: localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        const recordRelated = res.data.record_related;
        const memo = recordRelated.memo;
        setAppearanceMemo(memo.appearance);
        setBreakfastMemo(memo.breakfast);
        setLunchMemo(memo.lunch);
        setDinnerMemo(memo.dinner);
        setSnackMemo(memo.snack);
        setAppearancePath(recordRelated.appearances);
        setBreakfastPath(recordRelated.breakfasts);
        setLunchPath(recordRelated.lunchs);
        setDinnerPath(recordRelated.dinners);
        setSnackPath(recordRelated.snacks);
        setRecordId(String(res.data.record_id));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [year, month, day]);

  return (
    <div className="wrap">
      {currentUserId === uid ? (
        <>
          <ImageField
            text="見た目を記録する（最大5枚）"
            sheets={4}
            profile={false}
            imagePath={appearancePath}
            setAppearances={setAppearances}
            setAppearancesId={setAppearancesId}
          />
          <TextInput
            fullWidth={true}
            label="メモ"
            multiline={true}
            required={false}
            rows="5"
            type="text"
            name="appearance"
            value={appearanceMemo}
            onChange={inputAppearance}
          />
          <ImageField
            text="朝食を記録する（最大3枚）"
            sheets={2}
            profile={false}
            imagePath={breakfastPath}
            setBreakfasts={setBreakfasts}
            setMealsId={setMealsId}
          />
          <TextInput
            fullWidth={true}
            label="メモ"
            multiline={true}
            required={false}
            rows="5"
            type="text"
            name="breakfast"
            value={breakfastMemo}
            onChange={inputBreakfast}
          />
          <ImageField
            text="昼食を記録する（最大3枚）"
            sheets={2}
            profile={false}
            imagePath={lunchPath}
            setLunchs={setLunchs}
            setMealsId={setMealsId}
          />
          <TextInput
            fullWidth={true}
            label="メモ"
            multiline={true}
            required={false}
            rows="5"
            type="text"
            name="lunch"
            value={lunchMemo}
            onChange={inputLunch}
          />
          <ImageField
            text="夕食を記録する（最大3枚）"
            sheets={2}
            profile={false}
            imagePath={dinnerPath}
            setDinners={setDinners}
            setMealsId={setMealsId}
          />
          <TextInput
            fullWidth={true}
            label="メモ"
            multiline={true}
            required={false}
            rows="5"
            type="text"
            name="dinner"
            value={dinnerMemo}
            onChange={inputDinner}
          />
          <ImageField
            text="間食を記録する（最大3枚）"
            sheets={2}
            profile={false}
            imagePath={snackPath}
            setSnacks={setSnacks}
            setMealsId={setMealsId}
          />
          <TextInput
            fullWidth={true}
            label="メモ"
            multiline={true}
            required={false}
            rows="5"
            type="text"
            name="snack"
            value={snackMemo}
            onChange={inputSnack}
          />
          <div className="space-m"></div>
          <SecondaryButton text="更新する" onClick={updateRecord} />
        </>
      ) : (
        <p>記録がありません</p>
      )}
    </div>
  );
};

export default RecordEdit;
