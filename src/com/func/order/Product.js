
import Grid from "@material-ui/core/Grid";
import React, {useState} from 'react';
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
}));


export default function Product({
    category, product, setProductOrder
}) {
    const classes = useStyles();
    const [isCart, setIsCart] = useState(false);

    function onclickAddToCartHandle(evt, category, product){
        setIsCart(!isCart);
        if(isCart){
            setProductOrder((oldProductOrder)=>{
                const filter = oldProductOrder.filter((v, i)=>{
                    // console.log(v);
                    // console.log(v.category);
                    // console.log(v.product);
                    // console.log(category);
                    // console.log(product);
                    // console.log(v.category==category);
                    // console.log(v.product==product);
                    return !(v.category==category && v.product==product);
                });
                console.log(filter);
                return filter;
            });
        }else{
            setProductOrder((old)=>([
                ...old,
                {
                    category: category,
                    product: product
                }
            ]));
        }
        
    }
    return (
        <Grid xs="12" sm="3" item>
            <Card elevation={3}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image="https://t7mobile.com/wp-content/uploads/2021/01/apple-iphone-12-256gb-silver.png"
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
                            <Button size="small" variant={isCart?"contained":"outlined"} color="primary" onClick={(evt) => onclickAddToCartHandle(evt, category, product)}> {isCart ? "Bỏ khỏi" : "Thêm vào"} giỏ hàng</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    );
}