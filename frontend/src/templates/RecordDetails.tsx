import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Store } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { Target, Comment } from "../re-ducks/records/types";
import {
  AppearancesGallery,
  MealsGallery,
  CommentForm,
  CommentList,
} from "../components/Record";
import { TextInput } from "../components/UIkit";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
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
    openAndCloseCommentAreaText: {
      display: "flex",
      alignItems: "center",
    },
  })
);

type Props = {
  recordId: number;
  urlUid: number;
};

const RecordDetails: React.FC<Props> = (props) => {
  const classes = useStyles();
  const selector = useSelector((state: Store) => state);
  const uid = Number(getUserId(selector));
  const recordId = props.recordId;
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

  const [appearanceComment, setAppearanceComment] = useState(false);
  const [breakfastComment, setBreakfastComment] = useState(false);
  const [lunchComment, setLunchComment] = useState(false);
  const [dinnerComment, setDinnerComment] = useState(false);
  const [snackComment, setSnackComment] = useState(false);

  const [appearanceCommentList, setAppearanceCommentList] = useState<Comment[]>(
    []
  );
  const [breakfastCommentList, setBreakfastCommentList] = useState<Comment[]>(
    []
  );
  const [lunchCommentList, setLunchCommentList] = useState<Comment[]>([]);
  const [dinnerCommentList, setDinnerCommentList] = useState<Comment[]>([]);
  const [snackCommentList, setSnackCommentList] = useState<Comment[]>([]);

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

  const openAndCloseCommentArea = useCallback(
    (target: Target) => {
      switch (target) {
        case "appearance":
          setAppearanceCommentList([]);
          setAppearanceComment(!appearanceComment);
          break;
        case "breakfast":
          setBreakfastCommentList([]);
          setBreakfastComment(!breakfastComment);
          break;
        case "lunch":
          setLunchCommentList([]);
          setLunchComment(!lunchComment);
          break;
        case "dinner":
          setDinnerCommentList([]);
          setDinnerComment(!dinnerComment);
          break;
        case "snack":
          setSnackCommentList([]);
          setSnackComment(!snackComment);
      }
    },
    [
      appearanceComment,
      breakfastComment,
      lunchComment,
      dinnerComment,
      snackComment,
    ]
  );

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/appearances/${recordId}`)
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
      .get(`${baseURL}/api/v1/meals/${recordId}`)
      .then((res) => {
        for (const ele of res.data) {
          switch (ele.meal_type) {
            case "breakfast":
              breakfastsContainer.push(ele.image.url);
              break;
            case "lunch":
              lunchsContainer.push(ele.image.url);
              break;
            case "dinner":
              dinnersContainer.push(ele.image.url);
              break;
            case "snack":
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
      .get(`${baseURL}/api/v1/memos/${recordId}`)
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
  }, [recordId]);

  return (
    <div className="wrap">
      <p>💪 見た目</p>
      <div className={classes.record}>
        {appearances.length > 0 ? (
          <AppearancesGallery appearances={appearances} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
          {uid === props.urlUid ? (
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
          ) : (
            <TextInput
              fullWidth={true}
              label="メモ"
              multiline={true}
              required={false}
              rows="5"
              type="text"
              name="appearance"
              inputProps={{
                readOnly: true,
              }}
              value={appearanceMemo}
              onChange={inputAppearance}
            />
          )}
        </div>
      </div>
      {appearanceComment ? (
        <>
          <div className="inline-block pointer-h">
            <div
              className={classes.openAndCloseCommentAreaText}
              onClick={() => openAndCloseCommentArea("appearance")}
            >
              <span>コメントを非表示</span>
              <ArrowDropUpIcon />
            </div>
          </div>
          <CommentForm
            recordId={recordId}
            target="appearance"
            commentList={appearanceCommentList}
            setCommentList={setAppearanceCommentList}
          />
          <CommentList
            recordId={recordId}
            target="appearance"
            commentList={appearanceCommentList}
            setCommentList={setAppearanceCommentList}
          />
        </>
      ) : (
        <div className="inline-block pointer-h">
          <div
            className={classes.openAndCloseCommentAreaText}
            onClick={() => openAndCloseCommentArea("appearance")}
          >
            <span>コメントを表示</span>
            <ArrowDropDownIcon />
          </div>
        </div>
      )}
      <p>🍙 朝食</p>
      <div className={classes.record}>
        {breakfasts.length > 0 ? (
          <MealsGallery meals={breakfasts} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
          {uid === props.urlUid ? (
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
          ) : (
            <TextInput
              fullWidth={true}
              label="メモ"
              multiline={true}
              required={false}
              rows="5"
              type="text"
              name="breakfast"
              inputProps={{
                readOnly: true,
              }}
              value={breakfastMemo}
              onChange={inputBreakfast}
            />
          )}
        </div>
      </div>
      {breakfastComment ? (
        <>
          <div className="inline-block pointer-h">
            <div
              className={classes.openAndCloseCommentAreaText}
              onClick={() => openAndCloseCommentArea("breakfast")}
            >
              <span>コメントを非表示</span>
              <ArrowDropUpIcon />
            </div>
          </div>
          <CommentForm
            recordId={recordId}
            target="breakfast"
            commentList={breakfastCommentList}
            setCommentList={setBreakfastCommentList}
          />
          <CommentList
            recordId={recordId}
            target="breakfast"
            commentList={breakfastCommentList}
            setCommentList={setBreakfastCommentList}
          />
        </>
      ) : (
        <div className="inline-block pointer-h">
          <div
            className={classes.openAndCloseCommentAreaText}
            onClick={() => openAndCloseCommentArea("breakfast")}
          >
            <span>コメントを表示</span>
            <ArrowDropDownIcon />
          </div>
        </div>
      )}
      <p>🍔 昼食</p>
      <div className={classes.record}>
        {lunchs.length > 0 ? (
          <MealsGallery meals={lunchs} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
          {uid === props.urlUid ? (
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
          ) : (
            <TextInput
              fullWidth={true}
              label="メモ"
              multiline={true}
              required={false}
              rows="5"
              type="text"
              name="lunch"
              inputProps={{
                readOnly: true,
              }}
              value={lunchMemo}
              onChange={inputLunch}
            />
          )}
        </div>
      </div>
      {lunchComment ? (
        <>
          <div className="inline-block pointer-h">
            <div
              className={classes.openAndCloseCommentAreaText}
              onClick={() => openAndCloseCommentArea("lunch")}
            >
              <span>コメントを非表示</span>
              <ArrowDropUpIcon />
            </div>
          </div>
          <CommentForm
            recordId={recordId}
            target="lunch"
            commentList={lunchCommentList}
            setCommentList={setLunchCommentList}
          />
          <CommentList
            recordId={recordId}
            target="lunch"
            commentList={lunchCommentList}
            setCommentList={setLunchCommentList}
          />
        </>
      ) : (
        <div className="inline-block pointer-h">
          <div
            className={classes.openAndCloseCommentAreaText}
            onClick={() => openAndCloseCommentArea("lunch")}
          >
            <span>コメントを表示</span>
            <ArrowDropDownIcon />
          </div>
        </div>
      )}
      <p>🍖 夕食</p>
      <div className={classes.record}>
        {dinners.length > 0 ? (
          <MealsGallery meals={dinners} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
          {uid === props.urlUid ? (
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
          ) : (
            <TextInput
              fullWidth={true}
              label="メモ"
              multiline={true}
              required={false}
              rows="5"
              type="text"
              name="dinner"
              inputProps={{
                readOnly: true,
              }}
              value={dinnerMemo}
              onChange={inputDinner}
            />
          )}
        </div>
      </div>
      {dinnerComment ? (
        <>
          <div className="inline-block pointer-h">
            <div
              className={classes.openAndCloseCommentAreaText}
              onClick={() => openAndCloseCommentArea("dinner")}
            >
              <span>コメントを非表示</span>
              <ArrowDropUpIcon />
            </div>
          </div>
          <CommentForm
            recordId={recordId}
            target="dinner"
            commentList={dinnerCommentList}
            setCommentList={setDinnerCommentList}
          />
          <CommentList
            recordId={recordId}
            target="dinner"
            commentList={dinnerCommentList}
            setCommentList={setDinnerCommentList}
          />
        </>
      ) : (
        <div className="inline-block pointer-h">
          <div
            className={classes.openAndCloseCommentAreaText}
            onClick={() => openAndCloseCommentArea("dinner")}
          >
            <span>コメントを表示</span>
            <ArrowDropDownIcon />
          </div>
        </div>
      )}
      <p>🍰 間食</p>
      <div className={classes.record}>
        {snacks.length > 0 ? (
          <MealsGallery meals={snacks} />
        ) : (
          <img className={classes.noImage} src={NoImage} alt="画像なし" />
        )}
        <div className={classes.recordRight}>
          {uid === props.urlUid ? (
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
          ) : (
            <TextInput
              fullWidth={true}
              label="メモ"
              multiline={true}
              required={false}
              rows="5"
              type="text"
              name="snack"
              inputProps={{
                readOnly: true,
              }}
              value={snackMemo}
              onChange={inputSnack}
            />
          )}
        </div>
      </div>
      {snackComment ? (
        <>
          <div className="inline-block pointer-h">
            <div
              className={classes.openAndCloseCommentAreaText}
              onClick={() => openAndCloseCommentArea("snack")}
            >
              <span>コメントを非表示</span>
              <ArrowDropUpIcon />
            </div>
          </div>
          <CommentForm
            recordId={recordId}
            target="snack"
            commentList={snackCommentList}
            setCommentList={setSnackCommentList}
          />
          <CommentList
            recordId={recordId}
            target="snack"
            commentList={snackCommentList}
            setCommentList={setSnackCommentList}
          />
        </>
      ) : (
        <div className="inline-block pointer-h">
          <div
            className={classes.openAndCloseCommentAreaText}
            onClick={() => openAndCloseCommentArea("snack")}
          >
            <span>コメントを表示</span>
            <ArrowDropDownIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordDetails;
