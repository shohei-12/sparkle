import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { Store } from "../../re-ducks/store/types";
import { switchTabAction } from "../../re-ducks/users/actions";
import { flashAction } from "../../re-ducks/flash/actions";
import { getFlashMessageType } from "../../re-ducks/flash/selectors";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

type Props = {
  text: string;
  icon: JSX.Element;
  path: string;
  handleDrawerToggle: () => void;
};

const DrawerMenuListItem: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const type = getFlashMessageType(selector);

  const goPath = useCallback(() => {
    type && dispatch(flashAction({ type: "", msg: "" }));
    if (props.text === "マイページ") {
      dispatch(switchTabAction(0));
    }
    dispatch(push(props.path));
    if (window.innerWidth < 960) {
      props.handleDrawerToggle();
    }
  }, [dispatch, props, type]);

  return (
    <ListItem button onClick={goPath}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText primary={props.text} />
    </ListItem>
  );
};

export default DrawerMenuListItem;
