import React from "react";
import { useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { Store } from "../re-ducks/store/types";
import {
  getFlashMessage,
  getFlashMessageType,
} from "../re-ducks/flash/selectors";

const FlashMessage: React.FC = () => {
  const selector = useSelector((state: Store) => state);
  const msg = getFlashMessage(selector);
  const type = getFlashMessageType(selector);

  return (
    <>
      {type && (
        <Alert variant="filled" severity={type}>
          {msg}
        </Alert>
      )}
    </>
  );
};

export default FlashMessage;
