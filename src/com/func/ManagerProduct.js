
import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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

import { URL } from "./ManagerCategory.js";
import Loading from "./Loading.js";
import { formatMoney, alert } from "../../lib/lib.js";

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
    tabler: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(5)
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function ManagerProduct({
    setTitle, guest
}) {
    const classes = useStyles();
    const history = useHistory();
    const { url } = useRouteMatch();
    const searchs = new URLSearchParams(window.location.search);
    const [form, setForm] = useState({ id: "", portfolio_id: -1, name: "", price: "", desc: "" });
    const [formFilter, setFormFilter] = useState({ portfolio_id: -1 });
    const [clickId, setClickId] = useState(-1);
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [idCategory, setIdCategory] = useState(searchs.get("category") == null ? 1 : searchs.get("category"));
    const [page, setPage] = useState(Number(searchs.get("page") == null ? 1 : searchs.get("page")));
    const [load, setLoad] = useState(false);
    useEffect(() => {
        if (guest.permission != 0) {
            history.push("/order");
        }
        setTitle("Quản lý sản phẩm");
        setLoad(true);
        updateCategory();
    }, []);
    const onchangeInputHandler = (evt) => {
        setForm({
            ...form,
            [evt.target.name]: evt.target.value
        });
    }
    const onchangeInputFilterHandler = (evt) => {
        let name = evt.target.name;
        let value = evt.target.value;
        if (value != -1) {
            setFormFilter({
                ...formFilter,
                [name]: value
            });
            setIdCategory(value);
            setLoad(true);
            updateProduct(value, page);
        }
    }
    const onclickAddHandle = (evt) => {
        evt.preventDefault();
        setLoad(true);
        if (clickId == -1) {
            callbackPostProduct(
                form.portfolio_id,
                form,
                (resp) => {
                    setFormFilter({ portfolio_id: form.portfolio_id });
                    setIdCategory(form.portfolio_id);
                    setClickId(-1);
                    alert("Thành công!", "Thêm mới thành công!", "success", ()=> updateProduct(form.portfolio_id, page));
                },
                (err) => {
                    setLoad(false);
                    alert("Thất bại!", "Thêm mới thất bại!", "error");
                    console.log(err);
                }
            );
        } else {
            callbackPutProduct(
                form.portfolio_id,
                form.id,
                form,
                (resp) => {
                    setFormFilter({ portfolio_id: form.portfolio_id });
                    setIdCategory(form.portfolio_id);
                    setClickId(-1);
                    alert("Thành công!", "Sửa thành công!", "success", ()=> updateProduct(form.portfolio_id, page));
                },
                (err) => {
                    setLoad(false);
                    alert("Thất bại!", "Sửa thất bại!", "error");
                    console.log(err);
                }
            );
        }
    }
    const onclickRowTableHandler = (evt, v, i) => {
        illusionLoading();
        setForm(v);
        setClickId(v.id);
    }
    const onclickRefreshFormHandler = (evt) => {
        illusionLoading();
        evt.preventDefault();
        setForm({ id: "", portfolio_id: -1, name: "", price: "", desc: "" });
        setClickId(-1);
    }
    const onclickDeleteHandler = (evt) => {
        evt.preventDefault();
        setLoad(true);
        if (clickId != -1) {
            callbackDeleteProduct(
                form.portfolio_id,
                form.id,
                (resp) => {
                    setClickId(-1);
                    alert("Thành công!", "Xóa sản phẩm thành công!", "success", ()=>updateProduct(form.portfolio_id, page));
                },
                (err) => {
                    setLoad(false);
                    alert("Thất bại!", "Không thể xóa sản phẩm!", "error");
                }
            );
        }else{
            illusionLoading();
        }
    }
    const onclickPagingingHandler = (evt, value) => {
        setLoad(true);
        setPage(value);
        history.push(url + "?page=" + value + "&category=" + idCategory);
        updateProduct(idCategory, value);
    }

    const updateCategory = () => {
        callbackGetCategory(
            (resp) => {
                setLoad(false);
                setCategory(resp.data);
            },
            (err) => {
                setLoad(false);
                alert("Thất bại!", "Không thể lấy danh sách thể loại!", "error");
            }
        );
    }
    const updateProduct = (idCategory, page=1) => {
        callbackGetProduct(
            idCategory,
            page,
            (resp) => {
                setLoad(false);
                setProduct(resp.data);
            },
            (err) => {
                setLoad(false);
                alert("Thất bại!", "Không thể cập nhật sản phẩm", "error");
                console.log(err);
            }
        );
    }
    const illusionLoading = (time = 200) => {
        setLoad(true);
        setTimeout(() => { setLoad(false) }, time);
    }
    const callbackGetCategory = (succ, err) => {
        axios({
            method: "GET",
            url: URL,
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }

    const callbackGetProduct = (idCategory, page, succ, err) => {
        axios({
            method: "GET",
            url: URL + "/" + idCategory + "/product?page=" + page + "&limit=10",
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }
    const callbackPostProduct = (idCategory, data, succ, err) => {
        axios({
            method: "POST",
            url: URL + "/" + idCategory + "/product",
            data: data
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }
    const callbackPutProduct = (idCategory, idProduct, data, succ, err) => {
        axios({
            method: "PUT",
            url: URL + "/" + idCategory + "/product/" + idProduct,
            data: data
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }
    const callbackDeleteProduct = (idCategory, idProduct, succ, err) => {
        axios({
            method: "DELETE",
            url: URL + "/" + idCategory + "/product/" + idProduct,
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
                                    value={form.id}
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <InputLabel>Thể loại *</InputLabel>
                                <Select fullWidth name="portfolio_id" value={form.portfolio_id} onChange={onchangeInputHandler}>
                                    <MenuItem value={-1}>Chọn thể loại...</MenuItem>
                                    {
                                        category.map((v, i) => {
                                            return (<MenuItem value={v.id}>{v.name}</MenuItem>);
                                        })
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    name="name"
                                    label="Name"
                                    fullWidth
                                    value={form.name}
                                    onChange={onchangeInputHandler}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    name="price"
                                    label="Price"
                                    fullWidth
                                    value={form.price}
                                    onChange={onchangeInputHandler}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    name="desc"
                                    label="Description"
                                    fullWidth
                                    value={form.desc}
                                    onChange={onchangeInputHandler}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="outlined" color="primary" justify="center" onClick={onclickAddHandle}>{clickId == -1 ? "Thêm" : "Sửa"}</Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="outlined" color="secondary" maxWidth onClick={onclickRefreshFormHandler}>Làm mới</Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" color="secondary" onClick={onclickDeleteHandler} >Xóa</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.tabler}>
                    <Grid item xs={12} sm={4} >
                        <InputLabel>Lọc Thể loại *</InputLabel>
                        <Select fullWidth name="portfolio_id" value={formFilter.portfolio_id} onChange={onchangeInputFilterHandler}>
                            <MenuItem value={-1}>Chọn thể loại...</MenuItem>
                            {
                                category.map((v, i) => {
                                    return (<MenuItem value={v.id}>{v.name}</MenuItem>);
                                })
                            }
                        </Select>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell align="right">Name</TableCell>
                                    <TableCell align="right">Giá</TableCell>
                                    <TableCell align="right">Ghi chú</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    product.map((v, i) => {
                                        return (
                                            <TableRow key={i} onClick={(evt) => onclickRowTableHandler(evt, v, i)}>
                                                <TableCell component="th" scope="row">{v.id}</TableCell>
                                                <TableCell align="right">{v.name}</TableCell>
                                                <TableCell align="right">{formatMoney(v.price)}</TableCell>
                                                <TableCell align="right">{v.desc}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination count={10} page={page} onChange={onclickPagingingHandler} />
                </Grid>
            </Grid>
        </Container>
    );
}
export {
    URL
}