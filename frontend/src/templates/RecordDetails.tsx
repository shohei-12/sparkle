import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppearancesGallery, MealsGallery } from "../components/Record";
import { baseURL } from "../config";

type Props = {
  recordId: number;
  recordDate: string;
};

const RecordDetails: React.FC<Props> = (props) => {
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

  useEffect(() => {
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/appearances`,
      params: {
        id: props.recordId,
      },
    })
      .then((res) => {
        for (const ele of res.data) {
          appearancesContainer.push(ele.image.url);
        }
        setAppearances(appearancesContainer);
      })
      .catch((error) => {
        throw new Error(error);
      });
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/meals`,
      params: {
        id: props.recordId,
      },
    })
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
    axios({
      method: "GET",
      url: `${baseURL}/api/v1/memos/${props.recordId}`,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrap">
      <h2>{props.recordDate}</h2>
      {appearances.length > 0 && (
        <AppearancesGallery appearances={appearances} />
      )}
      {breakfasts.length > 0 && <MealsGallery meals={breakfasts} />}
      {lunchs.length > 0 && <MealsGallery meals={lunchs} />}
      {dinners.length > 0 && <MealsGallery meals={dinners} />}
      {snacks.length > 0 && <MealsGallery meals={snacks} />}
    </div>
  );
};

export default RecordDetails;
