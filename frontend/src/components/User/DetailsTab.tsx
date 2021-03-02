import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Calendar from 'react-calendar';
import { FollowList, FollowerList } from '.';
import { LikeRecordList } from '../Record';
import { switchTabAction } from '../../re-ducks/users/actions';
import { getTabIndex } from '../../re-ducks/users/selectors';
import { Store } from '../../re-ducks/store/types';
import 'react-calendar/dist/Calendar.css';

type Props = {
  uid: number;
  currentUserId: number;
  followingsLength: number;
  followersLength: number;
  likes: number;
  setFollowingsLength: React.Dispatch<React.SetStateAction<number>>;
  setFollowersLength: React.Dispatch<React.SetStateAction<number>>;
  setLikes: React.Dispatch<React.SetStateAction<number>>;
  over: (n: number) => void;
  leave: (n: number) => void;
};

const DetailsTab: React.FC<Props> = (props) => {
  const uid = props.uid;
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const tabIndex = getTabIndex(selector);
  const followingsLength = props.followingsLength;
  const followersLength = props.followersLength;

  const goRecordPage = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dispatch(push(`/record/${props.uid}/${year}/${month}/${day}`));
    },
    [dispatch, props.uid]
  );

  return (
    <>
      <ul className="tabs">
        {tabIndex === 0 ? (
          <li className="tab tab-selected">カレンダー</li>
        ) : (
          <li className="tab" onClick={() => dispatch(switchTabAction(0))}>
            カレンダー
          </li>
        )}
        {tabIndex === 1 ? (
          <li className="tab tab-selected">{`フォロー ${followingsLength}`}</li>
        ) : (
          <li className="tab" onClick={() => dispatch(switchTabAction(1))}>{`フォロー ${followingsLength}`}</li>
        )}
        {tabIndex === 2 ? (
          <li className="tab tab-selected">{`フォロワー ${followersLength}`}</li>
        ) : (
          <li className="tab" onClick={() => dispatch(switchTabAction(2))}>{`フォロワー ${followersLength}`}</li>
        )}
        {tabIndex === 3 ? (
          <li className="tab tab-selected">{`いいね ${props.likes}`}</li>
        ) : (
          <li className="tab" onClick={() => dispatch(switchTabAction(3))}>{`いいね ${props.likes}`}</li>
        )}
      </ul>
      {tabIndex === 0 && <Calendar calendarType="US" value={new Date()} onClickDay={goRecordPage} />}
      {tabIndex === 1 && <FollowList uid={uid} over={props.over} leave={props.leave} />}
      {tabIndex === 2 && <FollowerList uid={uid} over={props.over} leave={props.leave} />}
      {tabIndex === 3 && <LikeRecordList uid={uid} likes={props.likes} setLikes={props.setLikes} />}
    </>
  );
};

export default DetailsTab;
