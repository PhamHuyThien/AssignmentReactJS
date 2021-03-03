import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Backdrop from "@material-ui/core/Backdrop"
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
import { alert, setTitleWeb } from "../../lib/lib.js";

import Loading from "./Loading.js";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(16),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "red",
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    red: {
        background: "red"
    },
    z: {
        zIndex: 1000
    }
}));

const URL = "https://60177109f534300017a45537.mockapi.io/account";
export default function Login({
    guest, setTitle, setGuest, setProductOrder
}) {
    const classes = useStyles();
    const history = useHistory();
    const [formData, setFormData] = useState({ u: "", p: "" });
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setTitle("Đăng Nhập");
        setTitleWeb("Đăng nhập");
        if (guest.permission != 2) {
            history.push("/account");
        }
        illusionLoading(500);
    }, []);

    const [snackAlert, setSnackAlert] = useState({ open: false, text: "", type: "warning" });
    function snackBarAlert(text, type = "warning", timeout = 1500, open = true) {
        setSnackAlert({
            open: open,
            text: text,
            type: type,
        });
        if (open == true) {
            setTimeout(() => {
                snackBarAlert(text, type, timeout, false);
            }, timeout);
        }
    }

    const onChangeInputHandle = (evt) => {
        setFormData((oldData) => {
            return {
                ...oldData,
                [evt.target.name]: evt.target.value,
            }
        });
    }
    const onClickLoginHandler = (evt) => {
        evt.preventDefault();
        if (!checkFormLogin()) {
            return;
        }
        setLoad(true);
        callbackLogin(formData,
            (data) => {
                setGuest(data);
                setLoad(false);
                setProductOrder([]);
                alert("Thành công!", "Đăng nhập thành công!", "success", function () { history.push("/order") });
            },
            (e) => {
                setLoad(false);
                alert("Thất bại!", "Đăng nhập thất bại!", "error");
            }
        );
    }

    function checkFormLogin() {
        if (formData.u.trim() == "") {
            snackBarAlert("Tài khoản không được để trống!");
            return false;
        }
        if (formData.p.trim() == "") {
            snackBarAlert("Mật khẩu không được để trống!");
            return false;
        }
        return true;
    }
    const illusionLoading = (time = 200) => {
        setLoad(true);
        setTimeout(() => { setLoad(false) }, time);
    }

    const callbackLogin = (data, succ, err) => {
        axios({
            method: "GET",
            url: URL
        }).then((resp) => {
            let account = resp.data.filter((v, i) => {
                return v.u == data.u && v.p == data.p;
            });
            if (account.length == 1) {
                succ(account[0]);
            } else {
                err("Tài khoản mật khẩu sai!");
            }
        }).catch((e) => {
            err("Kết nối thất bại!");
        });
    }

    return (
        <Container component="main" maxWidth="xs" >
            <Loading open={load} />
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <form className={classes.form} validate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Tài khoản"
                        name="u"
                        autoComplete="email"
                        autoFocus
                        value={formData.u}
                        onChange={onChangeInputHandle}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="p"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.p}
                        onChange={onChangeInputHandle}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Lưu đăng nhập"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onClickLoginHandler}
                    >
                        Đăng nhập
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Quên mật khẩu?
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Snackbar open={snackAlert.open} autoHideDuration={1000}>
                <Alert elevation={6} variant="filled" severity={snackAlert.type}>{snackAlert.text}</Alert>
            </Snackbar>
        </Container>
    );
}
