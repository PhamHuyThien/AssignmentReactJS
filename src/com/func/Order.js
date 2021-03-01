
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import axios from "axios";

import { URL } from "./ManagerCategory.js";
import Loading from "./Loading.js";
import Checkout from "./order/Checkout.js";
import Category from "./order/Category.js";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(9),
        marginLeft: theme.spacing(7)
    }
}));

export default function Order({
    setTitle, setProductOrder, productOrder
}) {
    const classes = useStyles();
    const history = useHistory();
    const { url } = useRouteMatch();
    const [category, setCategory] = useState([]);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setTitle("Đặt hàng");
        setLoad(true);
        axios({
            method: "GET",
            url: URL
        }).then((resp) => {
            setLoad(false);
            setCategory(resp.data);
        }).catch((e) => {
            setLoad(false);
            setTimeout(() => { window.location.reload("") }, 10000);
        });
    }, []);
    
    return (
        <Container component="main" sm={12} xs={12} className={classes.container} maxWidth>
            <Loading open={load} />
            <Checkout productOrder={productOrder} />
            {
                category.map((v, i) => {
                    if(i==0) return (<Category category={v} key={i} setProductOrder={setProductOrder} />);
                })
            }
        </Container>
    );
}