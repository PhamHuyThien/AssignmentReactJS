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


import { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import axios from "axios";
import { formatMoney, milisToDateMaterial, dateMaterialToMilis, alert } from "../../lib/lib.js";
import Loading from "./Loading.js";

const URL = "https://60177109f534300017a45537.mockapi.io/voucher";


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


const callbackGetVoucher = (page, succ, err) => {
    axios({
        method: "GET",
        url: URL + "?page=" + page + "&limit=10"
    }).then((resp) => succ(resp)).catch((e) => err(e));
}
const callbackPutVoucher = (id, data, succ, err) => {
    axios({
        method: "PUT",
        url: URL + "/" + id,
        data: data
    }).then((resp) => succ(resp)).catch((e) => err(e));
}
const callbackPostVoucher = (data, succ, err) => {
    axios({
        method: "POST",
        url: URL,
        data: data
    }).then((resp) => succ(resp)).catch((e) => err(e));
}
const callbackDeleteVoucher = (id, succ, err) => {
    axios({
        method: "DELETE",
        url: URL + "/" + id,
    }).then((resp) => succ(resp)).catch((e) => err(e));
}

export default function ManagerVoucher({
    guest, setTitle,
}) {
    const { url } = useRouteMatch();
    const searchs = new URLSearchParams(window.location.search);
    const classes = useStyles();
    const history = useHistory();
    const [voucher, setVoucher] = useState([]);
    const [clickId, setClickId] = useState(-1);
    const [formData, setFormData] = useState({ id: "", code: "", discount: "", desc: "", time_end: milisToDateMaterial(new Date().getTime()) });
    const [page, setPage] = useState(Number(searchs.get("page") == null ? 1 : searchs.get("page")));
    const [load, setLoad] = useState(false);
    useEffect(() => {
        setTitle("Quản lý mã giảm giá");
        if (guest.permission != 0) {
            history.push("/order");
        }
        setLoad(true);
        updateVoucher(page);
    }, []);

    const onchangeInputHandler = (evt) => {
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value
        });
    }

    const onclickRowTableHandler = (evt, v, i) => {
        illusionLoading();
        setClickId(v.id);
        setFormData({ id: v.id, code: v.code, discount: v.discount, desc: v.desc, time_end: v.time_end });
    }
    const onclickRefreshFormHandle = () => {
        illusionLoading();
        setClickId(-1);
        setFormData({ id: "", code: "", discount: "", desc: "", time_end: milisToDateMaterial(new Date().getTime()) });
    }
    const onclickAddHandle = (evt) => {
        evt.preventDefault();
        setLoad(true);
        if (clickId == -1) {
            callbackPostVoucher(
                formData,
                (resp) => {
                    alert("Thành công!", "Thêm thành công!", "success", ()=>updateVoucher(page));
                },
                (err) => {
                    setLoad(false);
                    alert("Thất bại", "Thêm thất bại!", "error");
                }
            );
        } else {
            callbackPutVoucher(
                clickId,
                formData,
                (resp) => {
                    alert("Thành công!", "Sửa thành công!", "success", ()=>updateVoucher(page));
                },
                (err) => {
                    setLoad(false);
                    alert("Thất bại", "Sửa thất bại!", "error");
                }
            );
        }
    }
    const onclickDeleteHandle = (evt) => {
        evt.preventDefault();
        setLoad(true);
        if (clickId != -1) {
            callbackDeleteVoucher(
                clickId,
                (resp) => {
                    alert("Thành công!", "Xoá thành công!", "success", ()=>updateVoucher(page));
                },
                (err) => {
                    setLoad(false);
                    alert("Thất bại!", "Xóa thất bại!", "error");
                }
            );
        }else{
            illusionLoading();
        }

    }
    const onchangePagginationHandle = (evt, value) => {
        setLoad(true);
        history.push(url + "?page=" + value);
        setPage(value);
        updateVoucher(value);
    }
    const updateVoucher = (page) => {
        page = typeof page == "undefined" ? 1 : page;
        callbackGetVoucher(
            page,
            (data) => {
                setLoad(false);
                setVoucher(data.data);
            },
            (err) => {
                alert("Thât bại!", "Lỗi không thể lấy dữ liệu!", "error");
            }
        );
    }

    const illusionLoading = (time = 200) => {
        setLoad(true);
        setTimeout(() => { setLoad(false) }, time);
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
                                    name="code"
                                    label="Code"
                                    fullWidth
                                    value={formData.code}
                                    onChange={onchangeInputHandler}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    name="discount"
                                    label="Giảm giá"
                                    fullWidth
                                    value={formData.discount}
                                    onChange={onchangeInputHandler}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    name="desc"
                                    label="Nội dung"
                                    fullWidth
                                    value={formData.desc}
                                    onChange={onchangeInputHandler}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    name="time_end"
                                    label="Hết hạn"
                                    type="datetime-local"
                                    className={classes.textField}
                                    fullWidth
                                    value={formData.time_end}
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
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell align="right">Mã</TableCell>
                                    <TableCell align="right">Giảm giá</TableCell>
                                    <TableCell align="right">Ghi chú</TableCell>
                                    <TableCell align="right">Ngày hết hạn</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    voucher.map((v, i) => {
                                        return (
                                            <TableRow key={i} onClick={(evt) => onclickRowTableHandler(evt, v, i)}>
                                                <TableCell component="th" scope="row">{v.id}</TableCell>
                                                <TableCell align="right">{v.code}</TableCell>
                                                <TableCell align="right">{v.discount}</TableCell>
                                                <TableCell align="right">{v.desc}</TableCell>
                                                <TableCell align="right">{v.time_end}</TableCell>
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
        </Container>
    );
}


export {
    URL, callbackDeleteVoucher, callbackGetVoucher
}
