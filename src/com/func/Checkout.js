import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { formatMoney, nonAccentVietnamese } from "../../lib/lib.js";
import Loading from "./Loading.js";

import { callbackGetVoucher, callbackDeleteVoucher } from "./ManagerVoucher.js";


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginTop: theme.spacing(10),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    button1: {
        marginTop: theme.spacing(1),
    },
    right: {
        textAlign: "right"
    },
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: 700,
    },
    title: {
        marginTop: theme.spacing(2),
    },
}));

function AddressForm({ setAndresses, andresses,setLoad}) {
    useEffect(()=>{
        loadFake();
    }, []);
    function loadFake(time=200){
        setLoad(true);
        setTimeout(()=>{
            setLoad(false);
        }, 200);
    }
    function onchangeInputHandle(evt) {
        setAndresses((old) => ({
            ...old,
            [evt.target.name]: evt.target.value
        }));
    }
    
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Địa chỉ giao hàng
		  </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        name="name"
                        label="Họ và tên:"
                        fullWidth
                        value={andresses.name}
                        onChange={onchangeInputHandle}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        name="add"
                        label="Địa chỉ"
                        fullWidth
                        value={andresses.add}
                        onChange={onchangeInputHandle}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        name="phone"
                        label="Số điện thoại"
                        fullWidth
                        value={andresses.phone}
                        onChange={onchangeInputHandle}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                        label="Sử dụng địa chỉ này để biết chi tiết thanh toán."
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

function PaymentForm({ payment, setPayment, setLoad }) {
    useEffect(()=>{
        loadFake();
    }, []);
    function loadFake(time=200){
        setLoad(true);
        setTimeout(()=>{
            setLoad(false);
        }, 200);
    }
    function onchangeInputHandle(evt) {
        setPayment((old) => ({
            ...old,
            [evt.target.name]: evt.target.value
        }));
    }
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Phương thức thanh toán
	  </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField required label="Tên chủ thẻ" name="name" value={payment.name} onChange={onchangeInputHandle} fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        label="Mã tài khoản"
                        name="code"
                        fullWidth
                        value={payment.code}
                        onChange={onchangeInputHandle}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField required label="Ngày hết hạn" value={payment.ex} onChange={onchangeInputHandle} name="ex" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        name="cvv"
                        label="CVV"
                        helperText="Ba chữ số cuối cùng trên dải chữ ký!"
                        fullWidth
                        value={payment.cvv}
                        onChange={onchangeInputHandle}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                        label="Ghi nhớ chi tiết thẻ tín dụng cho lần sau."
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

function Review({
    productOrder, andresses, payment, totalPay, setTotalPay, setLoad
}) {
    useEffect(()=>{
        loadFake();
    }, []);
    function loadFake(time=200){
        setLoad(true);
        setTimeout(()=>{
            setLoad(false);
        }, 200);
    }
    const [voucherForm, setVoucherForm] = useState("");
    const classes = useStyles();


    const onchangeInputHandle = (evt) => {
        setVoucherForm(evt.target.value.toUpperCase());
    }
    const onclickActiveVoucherHandle = (evt) => {
        evt.preventDefault();
        callbackGetVoucher(
            (resp) => {
                let voucherTrue = resp.data.filter((v, i) => {
                    return v.code.toUpperCase() == voucherForm;
                });
                if (voucherTrue.length != 0) {
                    callbackDeleteVoucher(
                        voucherTrue[0].id,
                        () => {
                            let payPre = totalPay - voucherTrue[0].discount;
                            setTotalPay(payPre < 0 ? 0 : payPre);
                            alert("Sử dụng mã giảm giá thành công!\n" + voucherTrue[0].desc + "!");
                        }
                    );
                } else {
                    alert("Mã giảm giá không tồn tại!");
                }
            },
            (e) => {
                alert("Không thể đọc dữ liệu voucher từ server!");
            }
        );
    }
    const callbackGetVoucher = (succ, err) => {
        axios({
            method: "GET",
            url: "https://60177109f534300017a45537.mockapi.io/voucher"
        }).then((resp) => succ(resp)).catch((e) => err(e));
    }
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Xem lại đơn hàng
		  </Typography>
            <List disablePadding>
                <ListItem className={classes.listItem}>
                    <ListItemText primary={productOrder.category.name + " " + productOrder.product.name} secondary={productOrder.product.desc} />
                    <Typography variant="body2">{formatMoney(productOrder.product.price) + " VNĐ"}</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Grid container xs="12" sm="12" spacing="3">
                        <Grid item xs="12" sm="9">
                            <TextField
                                name="code"
                                label="Mã giảm giá"
                                fullWidth
                                value={voucherForm}
                                onChange={onchangeInputHandle}
                            />
                        </Grid>
                        <Grid item xs="12" sm="3" className={classes.right}>
                            <Button variant="outlined" color="primary" fullWidth className={classes.button1} onClick={onclickActiveVoucherHandle}>Kích hoạt</Button>
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Tổng:" />
                    <Typography variant="subtitle1" className={classes.total}>
                        {formatMoney(totalPay) + " VNĐ"}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Địa chỉ giao hàng:
			  </Typography>
                    <Typography gutterBottom>{andresses.name}</Typography>
                    <Typography gutterBottom>{andresses.add}</Typography>
                </Grid>
                <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Phương thức thanh toán:
			  </Typography>
                    <Grid container>
                        <React.Fragment >
                            <Grid item xs={6}>
                                <Typography gutterBottom>Tên chủ thẻ:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{payment.name}</Typography>
                            </Grid>
                        </React.Fragment>
                        <React.Fragment>
                            <Grid item xs={6}>
                                <Typography gutterBottom>Số tài khoản:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{payment.code}</Typography>
                            </Grid>
                        </React.Fragment>
                        <React.Fragment>
                            <Grid item xs={6}>
                                <Typography gutterBottom>Ngày hết hạn</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{payment.ex}</Typography>
                            </Grid>
                        </React.Fragment>
                        <React.Fragment>
                            <Grid item xs={6}>
                                <Typography gutterBottom>CVV</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{payment.cvv}</Typography>
                            </Grid>
                        </React.Fragment>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}



export default function Checkout({
    productOrder, guest, setTitle,
}) {
    const history = useHistory();
    useEffect(() => {
        if (typeof productOrder.category == "undefined" && typeof productOrder.product == "undefined") {
            history.push("/order");
        }
        setTitle("Thủ tục thanh toán");
    }, []);
    const [load, setLoad] = useState(false);
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const [andresses, setAddresses] = useState(guest);
    const [payment, setPayment] = useState({ name: nonAccentVietnamese(guest.name).toUpperCase(), code: "1234.5678.9999.9999", ex: "02/2024", cvv: "999" });
    const [totalPay, setTotalPay] = useState(productOrder.product.price);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <AddressForm setAddresses={setAddresses} andresses={andresses} setAndresses={setAddresses} setLoad={setLoad} />;
            case 1:
                return <PaymentForm payment={payment} setPayment={setPayment}  setLoad={setLoad}  />;
            case 2:
                return <Review productOrder={productOrder} andresses={andresses} payment={payment} totalPay={totalPay} setTotalPay={setTotalPay}  setLoad={setLoad} />;
            default:
                throw new Error('Unknown step');
        }
    }
    const illusionLoading = (funcLoad = () => { }, time = 200) => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
            funcLoad();
        }, time);
        return true;
    }
    return (
        <React.Fragment>
            <Loading open={load} />
            <CssBaseline />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Thủ tục thanh toán
          </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        <Step>
                            <StepLabel>Địa chỉ giao hàng</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Chi tiết thanh toán</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Xem lại đơn hàng</StepLabel>
                        </Step>
                    </Stepper>
                    <React.Fragment>
                        {activeStep === 3 ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Đặt hàng thành công!
                </Typography>
                                <Typography variant="subtitle1">
                                    Số đơn đặt hàng của bạn là #2001539. Chúng tôi sẽ gửi cho bạn thông tin cập nhật khi đơn hàng của bạn đã được giao.
                </Typography>
                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    {getStepContent(activeStep)}
                                    <div className={classes.buttons}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} className={classes.button}>
                                                Trở lại
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            className={classes.button}
                                        >
                                            {activeStep === 2 ? 'Đặt hàng' : 'Tiếp theo'}
                                        </Button>
                                    </div>
                                </React.Fragment>
                            )}
                    </React.Fragment>
                </Paper>
            </main>
        </React.Fragment>
    );
}