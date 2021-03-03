
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { useState, useEffect } from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: "10px",
        margin: "10px 0",
    },
    displayShow: {
        display: ""
    },
    displayHide: {
        display: "none"
    },
    checkoutbtn:{
        marginTop: "6px"
    }
}));

export default function ({
    category, setSearchCategory, setSearchName, productOrder,
}) {
    const history = useHistory();
    const classes = useStyles();
    const [formData, setFormData] = useState({ search_category: -1, search_name: "" })

    function onchangeSearchCategoryHandle(evt) {
        setFormData((oldFormData) => ({
            ...oldFormData,
            search_category: evt.target.value,
        }))
        setSearchCategory(evt.target.value);
    }
    function onchangeSearchNameHandle(evt) {
        setFormData((oldFormData) => ({
            ...oldFormData,
            search_name: evt.target.value.toLowerCase(),
        }));
        setSearchName(evt.target.value.toLowerCase());
    }
    function onclickCheckoutHandle(evt) {
        evt.preventDefault();
        history.push("/order/checkout");
    }
    return (
        <Paper className={classes.paper} >
            <Grid container xs={12} sm={12} justify={"left"} spacing={3} >
                <Grid item xs={6} sm={2} >
                    <InputLabel>Lọc Thể loại: </InputLabel>
                    <Select fullWidth name="search_category" value={formData.search_category} onChange={onchangeSearchCategoryHandle}>
                        <MenuItem value={-1}>Tất cả...</MenuItem>
                        {
                            category.map((v, i) => {
                                return (<MenuItem value={v.id}>{v.name}</MenuItem>);
                            })
                        }
                    </Select>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <TextField
                        name="search_name"
                        label="Lọc theo tên:"
                        fullWidth
                        value={formData.search_name}
                        onChange={onchangeSearchNameHandle}
                    />
                </Grid>
                <Grid item xs={6} sm={2}>
                    <TextField
                        name="search_price"
                        label="Lọc theo giá:"
                        fullWidth
                        value={formData.search_name}
                    />
                </Grid>
                <Grid item xs={6} sm={2}>
                    <TextField
                        name="search_desc"
                        label="Lọc theo mô tả:"
                        fullWidth
                        value={formData.search_name}
                    />
                </Grid>
                <Grid item xs={6} sm={2} >
                    <InputLabel>Phù hợp ví tiền:</InputLabel>
                    <Select fullWidth name="search_money" value={0}>
                        <MenuItem value={0}>Không</MenuItem>
                        <MenuItem value={1}>Có</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={6} sm={2} className={productOrder.length == 0 ? classes.displayHide : classes.displayShow} >
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Grid item>
                            <Button variant="contained" color="primary" size="small" onClick={onclickCheckoutHandle} className={classes.checkoutbtn}> <ShoppingCartIcon /> CheckOut + {productOrder.length}</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>

    );
}