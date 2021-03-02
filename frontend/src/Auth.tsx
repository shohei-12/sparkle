import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from './re-ducks/store/types';
import { getIsSignedIn, getTabIndex } from './re-ducks/users/selectors';
import { listenAuthState } from './re-ducks/users/operations';

const Auth: React.FC = ({ children }: any) => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const isSignedIn = getIsSignedIn(selector);
  const tabIndex = getTabIndex(selector);

  useEffect(() => {
    dispatch(listenAuthState(tabIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (!isSignedIn) {
    return <></>;
  } else {
    return children;
  }
};

export default Auth;
