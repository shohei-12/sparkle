import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { Store } from '../re-ducks/store/types';
import { getFlashMessage, getFlashMessageType } from '../re-ducks/flash/selectors';
import { flashAction } from '../re-ducks/flash/actions';

const FlashMessage: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const msg = getFlashMessage(selector);
  const type = getFlashMessageType(selector);

  type && window.setTimeout(() => dispatch(flashAction({ type: '', msg: '' })), 5000);

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
