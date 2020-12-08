import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { AppearancesGallery, MealsGallery } from "../components/Record";
import { TextInput } from "../components/UIkit";
import { baseURL } from "../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      marginBottom: 20,
      [theme.breakpoints.up("md")]: {
        display: "flex",
        marginBottom: 0,
      },
    },
  })
);

type Props = {
  recordId: number;
  recordDate: string;
};

const RecordDetails: React.FC<Props> = (props) => {
  const classes = useStyles();
  const appearancesContainer: string[] = [];
  const breakfastsContainer: string[] = [];
  const lunchsContainer: string[] = [];
  const dinnersContainer: string[] = [];
  const snacksContainer: string[] = [];

  const [appearances, setAppearances] = useState<string[]>([]);
  const [breakfasts, setBreakfasts] = useState<string[]>([]);
  const [lunchs, setLunchs] = useState<string[]>([]);
  const [dinners, setDinners] = useState<string[]>([]);
  const [snacks, setSnacks] = useState<string[]>([]);

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

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/appearances/${props.recordId}`)
      .then((res) => {
        for (const ele of res.data) {
          appearancesContainer.push(ele.image.url);
        }
        setAppearances(appearancesContainer);
      })
      .catch((error) => {
        throw new Error(error);
      });
    axios
      .get(`${baseURL}/api/v1/meals/${props.recordId}`)
      .then((res) => {
        for (const ele of res.data) {
          switch (ele.eating_time_id) {
            case 1:
              breakfastsContainer.push(ele.image.url);
              break;
            case 2:
              lunchsContainer.push(ele.image.url);
              break;
            case 3:
              dinnersContainer.push(ele.image.url);
              break;
            case 4:
              snacksContainer.push(ele.image.url);
          }
        }
        setBreakfasts(breakfastsContainer);
        setLunchs(lunchsContainer);
        setDinners(dinnersContainer);
        setSnacks(snacksContainer);
      })
      .catch((error) => {
        throw new Error(error);
      });
    axios
      .get(`${baseURL}/api/v1/memos/${props.recordId}`)
      .then((res) => {
        if (res.data) {
          setAppearanceMemo(res.data.appearance);
          setBreakfastMemo(res.data.breakfast);
          setLunchMemo(res.data.lunch);
          setDinnerMemo(res.data.dinner);
          setSnackMemo(res.data.snack);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrap">
      <h2>{props.recordDate}</h2>
      <p>💪 見た目</p>
      <div className={classes.box}>
        {appearances.length > 0 && (
          <AppearancesGallery appearances={appearances} />
        )}
        <TextInput
          fullWidth={true}
          label="メモ"
          multiline={true}
          required={false}
          rows="5"
          type="text"
          name="appearance"
          InputLabelProps={{
            shrink: true,
          }}
          value={appearanceMemo}
          onChange={inputAppearance}
        />
      </div>
      <p>🍙 朝食</p>
      <div className={classes.box}>
        {breakfasts.length > 0 && <MealsGallery meals={breakfasts} />}
        <TextInput
          fullWidth={true}
          label="メモ"
          multiline={true}
          required={false}
          rows="5"
          type="text"
          name="breakfast"
          InputLabelProps={{
            shrink: true,
          }}
          value={breakfastMemo}
          onChange={inputBreakfast}
        />
      </div>
      <p>🍔 昼食</p>
      <div className={classes.box}>
        {lunchs.length > 0 && <MealsGallery meals={lunchs} />}
        <TextInput
          fullWidth={true}
          label="メモ"
          multiline={true}
          required={false}
          rows="5"
          type="text"
          name="lunch"
          InputLabelProps={{
            shrink: true,
          }}
          value={lunchMemo}
          onChange={inputLunch}
        />
      </div>
      <p>🍖 夕食</p>
      <div className={classes.box}>
        {dinners.length > 0 && <MealsGallery meals={dinners} />}
        <TextInput
          fullWidth={true}
          label="メモ"
          multiline={true}
          required={false}
          rows="5"
          type="text"
          name="dinner"
          InputLabelProps={{
            shrink: true,
          }}
          value={dinnerMemo}
          onChange={inputDinner}
        />
      </div>
      <p>🍰 間食</p>
      <div className={classes.box}>
        {snacks.length > 0 && <MealsGallery meals={snacks} />}
        <TextInput
          fullWidth={true}
          label="メモ"
          multiline={true}
          required={false}
          rows="5"
          type="text"
          name="snack"
          InputLabelProps={{
            shrink: true,
          }}
          value={snackMemo}
          onChange={inputSnack}
        />
      </div>
    </div>
  );
};

export default RecordDetails;
