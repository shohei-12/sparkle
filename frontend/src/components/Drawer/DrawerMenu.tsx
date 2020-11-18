import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { DrawerMenuListItem } from ".";
import { getIsSignedIn } from "../../re-ducks/users/selectors";
import { signOut } from "../../re-ducks/users/operations";
import { Store } from "../../re-ducks/store/types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("md")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("md")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
  })
);

const DrawerMenu = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const isSignedIn = getIsSignedIn(selector);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [setMobileOpen, mobileOpen]);

  const goTop = useCallback(() => {
    dispatch(push("/"));
  }, [dispatch]);

  const dispatchSignOut = useCallback(() => {
    dispatch(signOut());
    if (window.innerWidth < 960) {
      handleDrawerToggle();
    }
  }, [dispatch, handleDrawerToggle]);

  const notSignInList = [
    {
      text: "ユーザーの登録",
      icon: <PersonAddIcon />,
      path: "/signup",
    },
  ];

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {isSignedIn ? (
          <List>
            <ListItem button onClick={dispatchSignOut}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="ログアウト" />
            </ListItem>
          </List>
        ) : (
          <>
            {notSignInList.map((item, index) => (
              <DrawerMenuListItem
                key={index}
                text={item.text}
                icon={item.icon}
                path={item.path}
                handleDrawerToggle={handleDrawerToggle}
              />
            ))}
          </>
        )}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className="pointer-h" variant="h6" onClick={goTop}>
            Sparkle
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="navigation">
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default DrawerMenu;
