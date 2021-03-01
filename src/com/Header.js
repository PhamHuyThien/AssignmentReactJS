import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(5),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        padding: theme.spacing(3),
    },
    title: {
        flexGrow: 1,
    },
    link: {
        textDecoration: "none",
        color: "#000",
    },
    icon: {
        color: "#fff",
    }
}));

export default function Header({
    guest, title
}) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [dividerAdmin, setDividerAdmin] = React.useState(<div />);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>

            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    <Link to="/account" className={classes.icon}>
                        <IconButton
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Link>
                    {typeof guest.permission != 2 && (<Typography variant="body1">{guest.name}</Typography>)}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Link to="/account" className={classes.link} onClick={() => { handleDrawerClose() }} >
                        <ListItem button >
                            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                            <ListItemText primary="Tài khoản" />
                        </ListItem>
                    </Link>
                    <Link to="/order" className={classes.link} onClick={() => { handleDrawerClose() }}>
                        <ListItem button >
                            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                            <ListItemText primary="Đặt Hàng" />
                        </ListItem>
                    </Link>
                </List>
                {guest.permission == 0 && (<div>
                    <Divider />
                    <List>
                        <Link to="/manager-category" className={classes.link} onClick={() => { handleDrawerClose() }}>
                            <ListItem button >
                                <ListItemIcon><CategoryIcon /></ListItemIcon>
                                <ListItemText primary="Quản Lý Thể Loại" />
                            </ListItem>
                        </Link>
                        <Link to="/manager-product" className={classes.link} onClick={() => { handleDrawerClose() }}>
                            <ListItem button >
                                <ListItemIcon><LoyaltyIcon /></ListItemIcon>
                                <ListItemText primary="Quản Lý Sản phẩm" />
                            </ListItem>
                        </Link>
                        <Link to="/manager-voucher" className={classes.link} onClick={() => { handleDrawerClose() }}>
                            <ListItem button >
                                <ListItemIcon><SentimentSatisfiedAltIcon /></ListItemIcon>
                                <ListItemText primary="Quản Lý Voucher" />
                            </ListItem>
                        </Link>
                    </List>
                </div>)}
            </Drawer>
        </div>
    );
}
