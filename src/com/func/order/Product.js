
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

import { formatMoney } from "../../../lib/lib.js";

const useStyles = makeStyles((theme) => ({
    media: {
        height: 360,
    },
    hidden: {
        display: "none",
    },
    show: {
        display: "block",
    }
}));


export default function Product({
    category, product, searchName, productOrder, setProductOrder,
}) {
    const classes = useStyles();
    const [isCart, setIsCart] = useState(false);

    useEffect(() => {
        setIsCart((oldIsCart) => {
            return productOrder.filter((v, i) => {
                return v.product.id == product.id;
            }).length == 1;
        });
    }, []);
    function onclickAddToCartHandle(evt, category, product) {
        if (isCart) {
            setProductOrder((oldProductOrder) => {
                const filter = oldProductOrder.filter((v, i) => {
                    return !(v.category.id == category.id && v.product.id == product.id);
                });
                return filter;
            });
        } else {
            setProductOrder((old) => ([
                ...old,
                {
                    category: category,
                    product: product,
                    count: 1,
                    totalMoney: Number(product.price),
                }
            ]));
        }
        setIsCart(!isCart);
    }
    return (
        <Grid xs="12" sm="3" item className={(category.name + " " + product.name).toLowerCase().indexOf(searchName) != -1 ? classes.show : classes.hidden} >
            <Card elevation={3}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image="https://zicxaphotos.com/wp-content/uploads/2019/09/girl-xinh-cap-3.jpg"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="subtitle1" align="center">{category.name + " " + product.name}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Thông số: {product.desc}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Giá bán: {formatMoney(product.price) + " VND"}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Grid container justify="center">
                        <Grid item>
                            <Button size="small" variant={isCart ? "contained" : "outlined"} color="primary" onClick={(evt) => onclickAddToCartHandle(evt, category, product)}> {isCart ? "Bỏ khỏi" : "Thêm vào"} giỏ hàng</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    );
}