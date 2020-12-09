import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { AppearancesGallery, MealsGallery } from "../components/Record";
import { SecondaryButton, TextInput } from "../components/UIkit";
import NoImage from "../assets/img/no-image.png";
import { baseURL } from "../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    record: {
      marginBottom: 20,
      textAlign: "center",
      [theme.breakpoints.up("md")]: {
        display: "flex",
        marginBottom: 0,
        textAlign: "start",
      },
    },
    recordRight: {
      maxWidth: 330,
      width: "100%",
      margin: "0 auto",
    },
    noImage: {
      maxWidth: 350,
      width: "100%",
      [theme.breakpoints.up("md")]: {
        marginRight: 20,
        marginBottom: 20,
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

  const [memoId, setMemoId] = useState(0);
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

  const updateAppearanceMemo = useCallback(() => {
    axios
      .put(`${baseURL}/api/v1/memos/${memoId}/appearance`, {
        appearance: appearanceMemo,
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [memoId, appearanceMemo]);

  const updateBreakfastMemo = useCallback(() => {
    axios
      .put(`${baseURL}/api/v1/memos/${memoId}/breakfast`, {
        breakfast: breakfastMemo,
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [memoId, breakfastMemo]);

  const updateLunchMemo = useCallback(() => {
    axios
      .put(`${baseURL}/api/v1/memos/${memoId}/lunch`, {
        lunch: lunchMemo,
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [memoId, lunchMemo]);

  const updateDinnerMemo = useCallback(() => {
    axios
      .put(`${baseURL}/api/v1/memos/${memoId}/dinner`, {
        dinner: dinnerMemo,
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [memoId, dinnerMemo]);

  const updateSnackMemo = useCallback(() => {
    axios
      .put(`${baseURL}/api/v1/memos/${memoId}/snack`, {
        snack: snackMemo,
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [memoId, snackMemo]);

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
          setMemoId(res.data.id);
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
      <div className={classes.record}>
        {appearances.length > 0 ? (
          <AppearancesGallery appearances={appearances} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
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
          <div className="space-m" />
          <SecondaryButton
            text="メモを更新する"
            onClick={updateAppearanceMemo}
          />
        </div>
      </div>
      <p>🍙 朝食</p>
      <div className={classes.record}>
        {breakfasts.length > 0 ? (
          <MealsGallery meals={breakfasts} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
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
          <div className="space-m" />
          <SecondaryButton
            text="メモを更新する"
            onClick={updateBreakfastMemo}
          />
        </div>
      </div>
      <p>🍔 昼食</p>
      <div className={classes.record}>
        {lunchs.length > 0 ? (
          <MealsGallery meals={lunchs} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
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
          <div className="space-m" />
          <SecondaryButton text="メモを更新する" onClick={updateLunchMemo} />
        </div>
      </div>
      <p>🍖 夕食</p>
      <div className={classes.record}>
        {dinners.length > 0 ? (
          <MealsGallery meals={dinners} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
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
          <div className="space-m" />
          <SecondaryButton text="メモを更新する" onClick={updateDinnerMemo} />
        </div>
      </div>
      <p>🍰 間食</p>
      <div className={classes.record}>
        {snacks.length > 0 ? (
          <MealsGallery meals={snacks} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
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
          <div className="space-m" />
          <SecondaryButton text="メモを更新する" onClick={updateSnackMemo} />
        </div>
      </div>
    </div>
  );
};

export default RecordDetails;
