import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Target, Comment } from "../re-ducks/records/types";
import {
  AppearancesGallery,
  MealsGallery,
  CommentForm,
  CommentList,
} from "../components/Record";
import { SecondaryButton } from "../components/UIkit";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import Button from "@material-ui/core/Button";
import NoImage from "../assets/img/no-image.png";
import { baseURL } from "../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnGroup: {
      marginTop: 10,
      textAlign: "right",
    },
    marginLeft: {
      marginLeft: 10,
    },
    text: {
      fontWeight: 400,
      color: theme.palette.primary["main"],
    },
    memo: {
      whiteSpace: "pre-wrap",
      maxWidth: 350,
      width: "100%",
      margin: "0 auto",
      textAlign: "left",
      "& > h3": {
        fontWeight: 400,
        marginTop: 0,
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
  const dispatch = useDispatch();
  const recordId = props.recordId;
  const appearancesContainer: string[] = [];
  const breakfastsContainer: string[] = [];
  const lunchsContainer: string[] = [];
  const dinnersContainer: string[] = [];
  const snacksContainer: string[] = [];
  const path = window.location.pathname;

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

  const deleteRecord = useCallback(() => {}, []);

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
    setAppearanceComment(false);
    setBreakfastComment(false);
    setLunchComment(false);
    setDinnerComment(false);
    setSnackComment(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  return (
    <div className="wrap record-details-page-wrap">
      <div className={classes.btnGroup}>
        <SecondaryButton
          text="編集する"
          onClick={() => dispatch(push(`${path}/edit`))}
        />
        <Button
          classes={{
            root: classes.marginLeft,
          }}
          variant="contained"
          onClick={deleteRecord}
        >
          削除
        </Button>
      </div>
      <h3 className={classes.text}>見た目</h3>
      <div className="record-image-memo">
        {appearances.length > 0 ? (
          <AppearancesGallery appearances={appearances} />
        ) : (
          <img
            className="record-details-page-no-image"
            src={NoImage}
            alt="画像なし"
          />
        )}
        <div className={classes.memo}>
          <h3>メモ</h3>
          <p>{appearanceMemo}</p>
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
      <h3 className={classes.text}>朝食</h3>
      <div className="record-image-memo">
        {breakfasts.length > 0 ? (
          <MealsGallery meals={breakfasts} />
        ) : (
          <img
            className="record-details-page-no-image"
            src={NoImage}
            alt="画像なし"
          />
        )}
        <div className={classes.memo}>
          <h3>メモ</h3>
          <p>{breakfastMemo}</p>
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
      <h3 className={classes.text}>昼食</h3>
      <div className="record-image-memo">
        {lunchs.length > 0 ? (
          <MealsGallery meals={lunchs} />
        ) : (
          <img
            className="record-details-page-no-image"
            src={NoImage}
            alt="画像なし"
          />
        )}
        <div className={classes.memo}>
          <h3>メモ</h3>
          <p>{lunchMemo}</p>
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
      <h3 className={classes.text}>夕食</h3>
      <div className="record-image-memo">
        {dinners.length > 0 ? (
          <MealsGallery meals={dinners} />
        ) : (
          <img
            className="record-details-page-no-image"
            src={NoImage}
            alt="画像なし"
          />
        )}
        <div className={classes.memo}>
          <h3>メモ</h3>
          <p>{dinnerMemo}</p>
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
      <h3 className={classes.text}>間食</h3>
      <div className="record-image-memo">
        {snacks.length > 0 ? (
          <MealsGallery meals={snacks} />
        ) : (
          <img
            className="record-details-page-no-image"
            src={NoImage}
            alt="画像なし"
          />
        )}
        <div className={classes.memo}>
          <h3>メモ</h3>
          <p>{snackMemo}</p>
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
