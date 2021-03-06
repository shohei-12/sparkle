import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { DrawerMenuListItem } from '.';
import {
  getIsSignedIn,
  getUserId,
  getUserProfile,
  getTheme,
} from '../../re-ducks/users/selectors';
import {
  signOut,
  deleteUser,
  toggleTheme,
} from '../../re-ducks/users/operations';
import { Store } from '../../re-ducks/store/types';
import { flashAction } from '../../re-ducks/flash/actions';
import { toggleThemeAction } from '../../re-ducks/users/actions';
import { getFlashMessageType } from '../../re-ducks/flash/selectors';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import WarningIcon from '@material-ui/icons/Warning';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import NoProfile from '../../assets/img/no-profile.png';
import Sparkle from '../../assets/img/sparkle.png';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    img: {
      width: 30,
      height: 30,
      objectFit: 'cover',
      borderRadius: '50%',
    },
    close: {
      position: 'relative',
      top: 4,
      left: 3,
    },
    light: {
      color: '#ff9800',
    },
    dark: {
      color: '#ffd600',
    },
    copyRight: {
      position: 'absolute',
      bottom: 0,
      paddingLeft: 16,
    },
  })
);

const DrawerMenu = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: Store) => state);
  const isSignedIn = getIsSignedIn(selector);
  const uid = getUserId(selector);
  const profile = getUserProfile(selector);
  const theme = getTheme(selector);
  const type = getFlashMessageType(selector);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [setMobileOpen, mobileOpen]);

  const goTop = useCallback(() => {
    type && dispatch(flashAction({ type: '', msg: '' }));
    dispatch(push('/'));
  }, [dispatch, type]);

  const dispatchSignOut = useCallback(() => {
    type && dispatch(flashAction({ type: '', msg: '' }));
    dispatch(signOut());
    if (window.innerWidth < 960) {
      handleDrawerToggle();
    }
  }, [dispatch, handleDrawerToggle, type]);

  const dispatchToggleLightTheme = useCallback(() => {
    isSignedIn
      ? dispatch(toggleTheme('light'))
      : dispatch(toggleThemeAction({ theme: 'light' }));
    if (window.innerWidth < 960) {
      handleDrawerToggle();
    }
  }, [dispatch, handleDrawerToggle, isSignedIn]);

  const dispatchToggleDarkTheme = useCallback(() => {
    isSignedIn
      ? dispatch(toggleTheme('dark'))
      : dispatch(toggleThemeAction({ theme: 'dark' }));
    if (window.innerWidth < 960) {
      handleDrawerToggle();
    }
  }, [dispatch, handleDrawerToggle, isSignedIn]);

  const dispatchDeleteUser = useCallback(() => {
    if (window.confirm('アカウントを削除しますか？')) {
      if (uid === '1') {
        alert('ゲストユーザーはアカウントを削除できません！');
        return;
      }
      dispatch(deleteUser());
      if (window.innerWidth < 960) {
        handleDrawerToggle();
      }
    }
  }, [dispatch, handleDrawerToggle, uid]);

  const signInList = [
    {
      text: 'マイページ',
      icon: (
        <img
          className={classes.img}
          src={profile ? profile : NoProfile}
          alt="プロフィール画像"
        />
      ),
      path: `/users/${uid}`,
    },
  ];

  const notSignInList = [
    {
      text: 'ユーザーの登録',
      icon: <PersonAddIcon />,
      path: '/signup',
    },
    {
      text: 'ログイン',
      icon: <ExitToAppIcon />,
      path: '/signin',
    },
  ];

  const themeListItem = (
    <>
      {theme === 'light' ? (
        <ListItem button onClick={dispatchToggleDarkTheme}>
          <ListItemIcon>
            <Brightness3Icon className={classes.dark} />
          </ListItemIcon>
          <ListItemText primary="ダークモード" />
        </ListItem>
      ) : (
        <ListItem button onClick={dispatchToggleLightTheme}>
          <ListItemIcon>
            <BrightnessHighIcon className={classes.light} />
          </ListItemIcon>
          <ListItemText primary="ライトモード" />
        </ListItem>
      )}
    </>
  );

  const drawer = (
    <div>
      <Hidden mdUp>
        <IconButton className={classes.close} onClick={handleDrawerToggle}>
          <ArrowBackIcon />
        </IconButton>
      </Hidden>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => {
            dispatch(push('/'));
            if (window.innerWidth < 960) {
              handleDrawerToggle();
            }
          }}
        >
          <ListItemIcon>
            <img className={classes.img} src={Sparkle} alt="画像" />
          </ListItemIcon>
          <ListItemText primary="トップページ" />
        </ListItem>
        {isSignedIn ? (
          <>
            {signInList.map((item, index) => (
              <DrawerMenuListItem
                key={index}
                text={item.text}
                icon={item.icon}
                path={item.path}
                handleDrawerToggle={handleDrawerToggle}
              />
            ))}
            <ListItem button onClick={dispatchSignOut}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="ログアウト" />
            </ListItem>
            {themeListItem}
            <ListItem button onClick={dispatchDeleteUser}>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText primary="アカウントの削除" />
            </ListItem>
          </>
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
            {themeListItem}
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
            <span className={classes.copyRight}>© 2021 MAEDASHOHEI</span>
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
            <span className={classes.copyRight}>© 2021 MAEDASHOHEI</span>
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default DrawerMenu;
