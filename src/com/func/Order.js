import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';

import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import axios from "axios";

import { URL } from "./ManagerCategory.js";
import Loading from "./Loading.js";
import { formatMoney } from "../../lib/lib.js";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(9),
        marginLeft: theme.spacing(7)
    },
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
    media: {
        height: 360,
    },
}));
export default function Order({
    setTitle, setProductOrder,
}) {
    const history = useHistory();
    const { url } = useRouteMatch();
    const classes = useStyles();
    const [cardPhoneComp, setCardPhoneComp] = useState([]);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        setTitle("Đặt hàng");
        callbackGetAll();
    }, []);

    const callbackGetAll = () => {
        setLoad(true);
        axios({
            method: "GET",
            url: URL
        }).then((resp) => {
            loadProduct(resp.data, 0, 500);
        }).catch((e) => {
        });
    }

    function loadProduct(v, i, time) {
        axios({
            method: "GET",
            url: URL + "/" + v[i].id + "/product"
        }).then((resp) => {
            setCardPhoneComp((old) => ([
                ...old,
                {
                    category: v[i],
                    listProduct: resp.data,
                }
            ]));
        }).catch((e) => {
        });
        if (i < v.length - 1) {
            setTimeout(() => { loadProduct(v, ++i, time) }, time);
        } else {
            setLoad(false);
        }
    }
    const CardPhoneComp = ({ category, listProduct }) => {
        const onclickOrderHandle = (evt, v, i) => {
            evt.preventDefault();
            setProductOrder({ category: category, product: v });
            history.push(url + "/checkout");

        }
        return (
            <Paper elevation={3} className={classes.paperContainer}>
                <Loading open={load} />
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
                            listProduct.map((v, i) => {
                                return (
                                    <Grid xs="12" sm="3" item>
                                        <Card elevation={3}>
                                            <CardActionArea>
                                                <CardMedia
                                                    className={classes.media}
                                                    image="https://t7mobile.com/wp-content/uploads/2021/01/apple-iphone-12-256gb-silver.png"
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="subtitle1" align="center">{category.name + " " + v.name}</Typography>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Thông số: {v.desc}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Giá bán: {formatMoney(v.price) + " VND"}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions>
                                                <Grid container justify="center">
                                                    <Grid item>
                                                        <Button size="small" variant="outlined" color="primary" onClick={(evt) => onclickOrderHandle(evt, v, i)}>Đặt hàng</Button>
                                                    </Grid>
                                                </Grid>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </Paper>);
    }


    return (
        <Container component="main" sm={12} xs={12} className={classes.container} maxWidth>
            {
                cardPhoneComp.map((v, i) => {
                    return (<CardPhoneComp category={v.category} listProduct={v.listProduct} />);
                })
            }
        </Container>
    );
}