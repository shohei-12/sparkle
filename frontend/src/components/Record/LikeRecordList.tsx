import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import ReactLoading from 'react-loading';
import axios from 'axios';
import { push } from 'connected-react-router';
import { switchTabAction } from '../../re-ducks/users/actions';
import { getUserId } from '../../re-ducks/users/selectors';
import { Store } from '../../re-ducks/store/types';
import { Record } from '../../re-ducks/records/types';
import { getLikeRecords } from '../../re-ducks/records/selectors';
import {
  addLikeRecords,
  likeRecord,
  unlikeRecord,
} from '../../re-ducks/records/operations';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';
import { baseURL } from '../../config';
import NoImage from '../../assets/img/no-image.png';
import NoProfile from '../../assets/img/no-profile.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    profile: {
      width: 40,
      height: 40,
      objectFit: 'cover',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      display: 'inline-block',
      padding: 0,
      margin: 16,
    },
    iconArea: {
      padding: '0 8px 8px',
    },
    unlikeIcon: {
      color: '#f44336',
    },
  })
);

type Props = {
  uid: number;
  likes: number;
  setLikes: React.Dispatch<React.SetStateAction<number>>;
};

const LikeRecordList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const uid = props.uid;
  const likes = props.likes;
  const setLikes = props.setLikes;
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const found = getLikeRecords(selector).find((ele) => ele.uid === uid);
  const likeRecords = found?.records;
  const start = found?.start;
  const currentUserId = Number(getUserId(selector));
  const [hasMore, setHasMore] = useState(true);

  const goUserDetailsPage = useCallback(
    (author_id: number) => {
      dispatch(switchTabAction(0));
      localStorage.setItem('scrollY-like_records', String(window.scrollY));
      dispatch(push(`/users/${author_id}`));
    },
    [dispatch]
  );

  const goRecordDetailsPage = useCallback(
    (author_id: number, dateString: string) => {
      localStorage.setItem('scrollY-like_records', String(window.scrollY));
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dispatch(push(`/record/${author_id}/${year}/${month}/${day}`));
    },
    [dispatch]
  );

  const get20LikeRecords = useCallback(() => {
    if (found) {
      axios
        .get(`${baseURL}/api/v1/users/${uid}/like-records`, {
          params: {
            start,
            uid: localStorage.getItem('uid'),
            client: localStorage.getItem('client'),
            access_token: localStorage.getItem('access_token'),
          },
        })
        .then((res) => {
          const twentyLikeRecords: Record[] = res.data;
          if (twentyLikeRecords.length === 0) {
            setHasMore(false);
            return;
          }
          start !== undefined &&
            dispatch(addLikeRecords(uid, twentyLikeRecords, start + 20));
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [found, dispatch, uid, start]);

  const decreaseLikes = useCallback(() => {
    setLikes(likes - 1);
  }, [likes, setLikes]);

  return (
    <InfiniteScroll
      loadMore={get20LikeRecords}
      hasMore={hasMore}
      loader={
        <ReactLoading key={0} className="loader" type="spin" color="#2196f3" />
      }
    >
      {likeRecords &&
        likeRecords.length > 0 &&
        likeRecords.map((ele, i) => (
          <Card
            key={i}
            className="inline-block pointer-h like-record"
            onClick={() => goRecordDetailsPage(ele.author_id, ele.date)}
          >
            <Tooltip title="ユーザー詳細" placement="bottom-start">
              <div>
                <CardHeader
                  avatar={
                    <Avatar>
                      <img
                        className={classes.profile}
                        src={ele.profile.url ? ele.profile.url : NoProfile}
                        alt="プロフィール画像"
                      />
                    </Avatar>
                  }
                  title={ele.author}
                  subheader={ele.date}
                  onClick={(
                    e: React.MouseEvent<HTMLImageElement, MouseEvent>
                  ) => {
                    e.stopPropagation();
                    goUserDetailsPage(ele.author_id);
                  }}
                />
              </div>
            </Tooltip>
            <CardMedia
              className={classes.media}
              image={ele.appearance ? ele.appearance.image.url : NoImage}
            />
            <CardContent className={classes.cardContent}>
              詳細を見る
            </CardContent>
            <div className={classes.iconArea}>
              {ele.liking ? (
                <Tooltip title="いいね解除">
                  <IconButton
                    aria-label="いいね解除"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      e.stopPropagation();
                      dispatch(unlikeRecord(ele.record_id, i, uid));
                      uid === currentUserId && decreaseLikes();
                    }}
                  >
                    <FavoriteIcon className={classes.unlikeIcon} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="いいね">
                  <IconButton
                    aria-label="いいね"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      e.stopPropagation();
                      dispatch(likeRecord(ele.record_id, i, uid));
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              )}
              <span>{ele.likes}</span>
            </div>
          </Card>
        ))}
    </InfiniteScroll>
  );
};

export default LikeRecordList;
