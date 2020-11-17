import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
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

  const goPath = useCallback(() => {
    dispatch(push(props.path));
    if (window.innerWidth < 960) {
      props.handleDrawerToggle();
    }
  }, [dispatch, props]);

  return (
    <ListItem button onClick={goPath}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText primary={props.text} />
    </ListItem>
  );
};

export default DrawerMenuListItem;
