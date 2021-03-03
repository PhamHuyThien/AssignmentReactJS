import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';


import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Paper from '@material-ui/core/Paper';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import axios from "axios";

import { alert, confirm, setTitleWeb } from "../../lib/lib.js";
import Loading from "./Loading.js";

const URL = "https://60177109f534300017a45537.mockapi.io/portfolio";


const useStyles = makeStyles((theme) => ({
    cont: {
        marginTop: theme.spacing(10),
        marginLeft: theme.spacing(8),
    },
    paper: {
        marginTop: theme.spacing(10),
    },
    paperForm: {
        padding: theme.spacing(3)
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function ManagerCategory({
    guest, setTitle,
}) {
    const { url } = useRouteMatch();
    const searchs = new URLSearchParams(window.location.search);
    const classes = useStyles();
    const history = useHistory();
    const [category, setCategory] = useState([]);
    const [categoryRoot, setCategoryRoot] = useState([]);
    const [clickId, setClickId] = useState(-1);
    const [formData, setFormData] = useState({ id: "", name: "" });
    const [page, setPage] = useState(Number(searchs.get("page") == null ? 1 : searchs.get("page")));
    const [searchForm, setSearchForm] = useState("");
    const [load, setLoad] = useState(false);
    const [snackAlert, setSnackAlert] = useState({ open: false, text: "", type: "warning" });


    useEffect(() => {
        setTitle("Quản lý mặt hàng");
        setTitleWeb("Quản lý mặt hàng");
        if (guest.permission != 0) {
            history.push("/order");
        }
        setLoad(true);
        updateCategory(page);
    }, []);

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
    const onchangeInputHandler = (evt) => {
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value
        });
    }

    function onchangeSearchHandle(evt) {
        evt.preventDefault();
        setSearchForm(evt.target.value);
        if (evt.target.value.trim() != "") {
            setCategory(() => {
                return categoryRoot.filter((v, i) => {
                    return v.name.toLowerCase().indexOf(evt.target.value.trim()) != -1;
                });
            });
        } else {
            setCategory(categoryRoot);
        }
    }

    const onclickRowTableHandler = (evt, v, i) => {
        illusionLoading();
        setClickId(v.id);
        setFormData({ id: v.id, name: v.name });
    }
    const onclickRefreshFormHandle = () => {
        illusionLoading();
        setClickId(-1);
        setFormData({ id: "", name: "" });
    }
    const onclickAddHandle = (evt) => {
        evt.preventDefault();
        if (!checkFormCategory()) {
            return;
        }
        setLoad(true);
        if (clickId == -1) {
            setLoad(true);
            callbackPostCategory(
                formData,
                (resp) => {
                    setLoad(false);
                    updateCategory(page);
                    alert("Thành công!", "Thêm thành công!");
                },
                (err) => {
                    setLoad(false);
                    alert("Thất bại!", "Thêm thất bại!", "error");
                }
            );
        } else {
            callbackPutCategory(
                clickId,
                formData,
                (resp) => {
                    alert("Thành công!", "Sửa thành công!", "success", () => updateCategory(page));
                },
                (err) => {
                    setLoad(false);
                    alert("Thất bại!", "Sửa thất bại!", "error");
                }
            );
        }
    }
    const onclickDeleteHandle = (evt) => {
        evt.preventDefault();
        setLoad(true);
        if (clickId != -1) {
            confirm("Xóa?", "Bạn chắc chắn muốn xóa chứ?", "warning", () => {
                callbackDeleteCategory(
                    clickId,
                    (resp) => {
                        alert("Thành công!", "Xoá thành công!", "success", () => updateCategory(page));
                    },
                    (err) => {
                        setLoad(false);
                        alert("Xóa thất bại!");
                    }
                );
            }, setLoad(false));

        } else {
            illusionLoading();
        }

    }
    const onchangePagginationHandle = (evt, value) => {
        setLoad(true);
        history.push(url + "?page=" + value);
        setPage(value);
        updateCategory(value);
    }
    const updateCategory = (page = 1) => {
        callbackGetCategory(
            page,
            (data) => {
                setCategoryRoot(data.data);
                setCategory(data.data);
                setLoad(false);
            },
            (err) => {
                setLoad(false);
                alert("Thất bại!", "Không thể lấy dữ liệu!", "error");
            }
        );
    }

    function checkFormCategory() {
        if (formData.name.trim() == "") {
            snackBarAlert("Tên thể loại không được để trống!");
            return false;
        }
        return true;
    }

    const illusionLoading = (time = 200) => {
        setLoad(true);
        setTimeout(() => { setLoad(false) }, time);
    }

    const callbackGetCategory = (page, succ, err) => {
        axios({
            method: "GET",
            url: URL + "?page=" + page + "&limit=10"
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }
    const callbackPutCategory = (id, data, succ, err) => {
        axios({
            method: "PUT",
            url: URL + "/" + id,
            data: data
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }
    const callbackPostCategory = (data, succ, err) => {
        axios({
            method: "POST",
            url: URL,
            data: data
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }
    const callbackDeleteCategory = (id, succ, err) => {
        axios({
            method: "DELETE",
            url: URL + "/" + id,
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }
    return (
        <Container component="main" sm={12} xs={12} className={classes.cont}>
            <Loading open={load} />
            <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paperForm}>
                        <Typography variant="h6" gutterLeft>
                            Mặt hàng:
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    name="id"
                                    label="Id"
                                    fullWidth
                                    value={formData.id}
                                    disabled={true}
                                    onChange={onchangeInputHandler}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    name="name"
                                    label="Name"
                                    fullWidth
                                    value={formData.name}
                                    onChange={onchangeInputHandler}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="outlined" color="primary" justify="center" onClick={onclickAddHandle}>{clickId == -1 ? "Thêm" : "Sửa"}</Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="outlined" color="secondary" maxWidth onClick={onclickRefreshFormHandle}>Làm mới</Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" color="secondary" onClick={onclickDeleteHandle}>Xóa</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            name="search"
                            label="Tìm kiếm..."
                            fullWidth
                            value={searchForm}
                            onChange={onchangeSearchHandle}
                        />
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell align="right">Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    category.map((v, i) => {
                                        return (
                                            <TableRow key={i} onClick={(evt) => onclickRowTableHandler(evt, v, i)}>
                                                <TableCell component="th" scope="row">{v.id}</TableCell>
                                                <TableCell align="right">{v.name}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination count={10} page={page} onChange={onchangePagginationHandle} />
                </Grid>
            </Grid>
            <Snackbar open={snackAlert.open} autoHideDuration={1000}>
                <Alert elevation={6} variant="filled" severity={snackAlert.type}>{snackAlert.text}</Alert>
            </Snackbar>
        </Container>
    );
}


export {
    URL
}
