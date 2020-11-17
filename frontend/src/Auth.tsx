import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "./re-ducks/store/types";
import { getIsSignedIn } from "./re-ducks/users/selectors";
import { listenAuthState } from "./re-ducks/users/operations";

const Auth: React.FC = ({ children }: any) => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const isSignedIn = getIsSignedIn(selector);

  useEffect(() => {
    dispatch(listenAuthState());
  }, [dispatch]);

  if (!isSignedIn) {
    return <></>;
  } else {
    return children;
  }
};

export default Auth;
