
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import { useEffect, useState } from "react";

import axios from "axios";

import { URL } from "../ManagerCategory.js";
import Product from "./Product.js";

const useStyles = makeStyles((theme) => ({
    paperTitle: {
        background: "#4b5bb3",
        color: "#fff",
        padding: 5,
    },
    gridContainer: {
        marginTop: "1px"
    },
    paperContainer: {
        padding: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    hidden: {
        display: "none",
    }
}));


export default function Category({
    category, searchCategory, searchName, productOrder, setProductOrder,
}) {
    const classes = useStyles();
    const [product, setProduct] = useState([]);
    useEffect(() => {
        callbackGetProduct(
            category.id,
            (resp) => {
                setProduct(resp.data);
            }
        );
    }, []);

    function callbackGetProduct(idCategory, succ, err) {
        axios({
            method: "GET",
            url: URL + "/" + idCategory + "/product",
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }

    return (
        <Paper elevation={3} className={searchCategory == -1 || category.id == searchCategory ?  classes.paperContainer : classes.hidden }>
            <Grid xs="12" sm="12" >
                <Paper className={classes.paperTitle} elevation={6}>
                    <Grid container spacing="2" >
                        <Grid item>
                            <LoyaltyIcon />
                        </Grid>
                        <Grid item >
                            <Typography variant="subtitle1" display="block">Sản phẩm {category.name}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Grid container justify="left" spacing={6} className={classes.gridContainer}>
                    {
                        product.length != 0 ? product.map((v, i) => {
                            return (<Product category={category} product={v} searchName={searchName} productOrder={productOrder} setProductOrder={setProductOrder} key={i} />);
                        }) : (<Typography>Xin chờ</Typography>)
                    }
                </Grid>
            </Grid>
        </Paper>
    );
}