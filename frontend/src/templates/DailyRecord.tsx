import React from "react";
import { ImageField } from "../components/UIkit";

const DailyRecord: React.FC = () => {
  return (
    <div className="wrap">
      <h2>今日の記録</h2>
      <ImageField
        text="見た目を記録する（最大8枚）"
        sheets={7}
        profile={false}
      />
      <ImageField text="朝食を記録する（最大3枚）" sheets={2} profile={false} />
      <ImageField text="昼食を記録する（最大3枚）" sheets={2} profile={false} />
      <ImageField text="夕食を記録する（最大3枚）" sheets={2} profile={false} />
      <ImageField text="間食を記録する（最大3枚）" sheets={2} profile={false} />
    </div>
  );
};

export default DailyRecord;
