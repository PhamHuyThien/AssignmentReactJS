import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { useHistory, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    displayHide: {
        display: "none"
    },
    displayShow: {
        display: ""
    },
    paperCheckout: {
        width: "100%",
        padding: 10,
        textAlign: "right"
    },
}));


export default function Checkout({
    productOrder,
}) {
    
    const { url } = useRouteMatch();
    const history = useHistory();
    const classes = useStyles();

    function onclickCheckoutHandle(evt) {
        evt.preventDefault();
        history.push("/order/checkout");
    }
    
    return (
        <div className={productOrder.length == 0 ? classes.displayHide : classes.displayShow} >
            <Grid container xs="12" sm="12">
                <Paper className={classes.paperCheckout} >
                    <Button variant="contained" color="primary" size="small" onClick={onclickCheckoutHandle}> <ShoppingCartIcon /> CheckOut + {productOrder.length}</Button>
                </Paper>
            </Grid>
        </div>
    );
}