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
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { formatMoney, nonAccentVietnamese, alert, isNumber, setTitleWeb} from "../../lib/lib.js";
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
    buttonGr: {
        width: "50px"
    },
    gridItem: {
        margin: "5px 0",
    }
}));

function OrderVerificationForm({
    productOrder,
    setProductOrder,
}) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Xác  thực đơn hàng
		  </Typography>
            <Grid container xs="12" sm="12" justify="space-between" alignItems="center" >
                {
                    productOrder.map((v, i) => {
                        return <OrderVerificationItemForm productOrder={v} setProductOrder={setProductOrder} />;
                    })
                }
            </Grid>
        </React.Fragment>
    );
}

function OrderVerificationItemForm({
    productOrder, setProductOrder,
}) {
    const classes = useStyles();
    const history = useHistory();
    const [formData, setFormData] = useState(productOrder);

    function onclickUp(evt) {
        let data;
        setFormData((oldData) => {
            const newData = {
                ...oldData,
                count: ++oldData.count,
                totalMoney: Number(oldData.product.price) * Number(oldData.count),
            }
            data = newData;
            return newData;
        });
        setProductOrder((oldProductOrder) => {
            return oldProductOrder.map((v, i) => {
                return v.product.id == productOrder.product.id ? data : v;
            });
        })
    }
    function onclickDown(evt) {
        if (formData.count - 1 == 0) {
            return;
        }
        let data;
        setFormData((oldData) => {
            const newData = {
                ...oldData,
                count: --oldData.count < 1 ? 1 : oldData.count,
                totalMoney: Number(oldData.product.price) * Number(oldData.count),
            }
            data = newData;
            return newData;
        });
        setProductOrder((oldProductOrder) => {
            return oldProductOrder.map((v, i) => {
                return v.product.id == productOrder.product.id ? data : v;
            });
        });
    }
    function onclickDeleteHandle(evt) {
        evt.preventDefault();
        let length = -1;
        setProductOrder((oldProductOrder) => {
            let productOrderTmp = oldProductOrder.filter((v, i) => {
                return v.product.id != productOrder.product.id;
            });
            length = productOrderTmp.length;
            return productOrderTmp;
        });
        console.log(length);
        if (length == 0) {
            history.push("/order");
        }
    }
    return (
        <Grid container item xs="12" sm="12" spacing="3" className={classes.gridItem} >
            <Grid item xs="12" sm="3">
                <Typography>{formData.category.name + " " + formData.product.name}</Typography>
                <Typography variant="body2">{formData.product.desc}</Typography>
            </Grid>
            <Grid item xs="12" sm="4" alignItems="center" >
                <Typography>{formatMoney(formData.totalMoney) + " VND"}</Typography>
            </Grid>
            <Grid item xs="12" sm="3" >
                <ButtonGroup color="primary" size="small" className={classes.buttonGr}>
                    <Button variant="contained" color="secondary" onClick={onclickDown}>-</Button>
                    <TextField value={formData.count}></TextField>
                    <Button variant="contained" color="primary" onClick={onclickUp}>+</Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs="12" sm="2" justify="center">
                <Button variant="contained" color="secondary" onClick={onclickDeleteHandle}>Delete</Button>
            </Grid>
        </Grid>
    );
}
function AddressForm({
    setAndresses,
    andresses,
    setLoad,
    snackAlert,
}) {
    useEffect(() => {
        loadFake();
    }, []);
    function loadFake(time = 200) {
        setLoad(true);
        setTimeout(() => {
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
            <Snackbar open={snackAlert.open} autoHideDuration={1000}>
                <Alert elevation={6} variant="filled" severity={snackAlert.type}>{snackAlert.text}</Alert>
            </Snackbar>
        </React.Fragment>
    );
}

function PaymentForm({
    payment, setPayment, setLoad,
}) {
    useEffect(() => {
        loadFake();
    }, []);
    function loadFake(time = 200) {
        setLoad(true);
        setTimeout(() => {
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
    productOrder, andresses, payment, setLoad,
}) {
    const [totalPay, setTotalPay] = useState(getTotalPay(productOrder));

    function getTotalPay(productOrder) {
        let total = 0;
        for (let i = 0; i < productOrder.length; i++) {
            total += Number(productOrder[i].totalMoney);
        }
        return total;
    }
    useEffect(() => {
        loadFake();
    }, []);
    function loadFake(time = 200) {
        setLoad(true);
        setTimeout(() => {
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
        setLoad(true);
        callbackGetVoucher(
            (resp) => {
                setLoad(false);
                let voucherTrue = resp.data.filter((v, i) => {
                    return v.code.toUpperCase() == voucherForm;
                });
                if (voucherTrue.length != 0) {
                    callbackDeleteVoucher(
                        voucherTrue[0].id,
                        () => {
                            alert("Sử dụng mã giảm giá thành công!", voucherTrue[0].desc + "!", "success", () => {
                                let payPre = totalPay - voucherTrue[0].discount;
                                setTotalPay(payPre < 0 ? 0 : payPre);
                            });
                        }
                    );
                } else {
                    setLoad(false);
                    alert("Thất bại!", "Mã giảm giá không tồn tại!", "error");
                }
            },
            (e) => {
                setLoad(false);
                alert("Thất bại!", "Không thể đọc dữ liệu voucher từ server!", "error");
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
                {
                    productOrder.map((v, i) => {
                        return (
                            <ListItem className={classes.listItem}>
                                <ListItemText primary={v.category.name + " " + v.product.name} secondary={v.product.desc} />
                                <ListItemText primary={"X" + v.count} secondary={"sản phẩm"} />
                                <Typography variant="body2">{formatMoney(v.totalMoney) + " VNĐ"}</Typography>
                            </ListItem>
                        );
                    })
                }

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
                        Thông tin giao hàng:
			  </Typography>
                    <Typography gutterBottom>Tên: {andresses.name}</Typography>
                    <Typography gutterBottom>Địa chỉ: {andresses.add}</Typography>
                    <Typography gutterBottom>SDT: {andresses.phone}</Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}



export default function Checkout({
    productOrder, guest, setTitle, setProductOrder,
}) {
    const history = useHistory();
    useEffect(() => {
        if (productOrder.length == 0) {
            history.push("/order");
        }
        setTitle("Thủ tục thanh toán");
        setTitleWeb("Thủ  tục thanh toán");
    }, []);
    const [load, setLoad] = useState(false);
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const [andresses, setAddresses] = useState(guest);
    const [payment, setPayment] = useState({ name: nonAccentVietnamese(guest.name).toUpperCase(), code: "1234.5678.9999.9999", ex: "02/2024", cvv: "999" });

    const [snackAlert, setSnackAlert] = useState({ open: false, text: "", type: "warning" });
    function snackBarAlert(text, type = "warning", timeout = 1500, open = true) {
        setSnackAlert({
            open: open,
            text: text,
            type: type,
        });
        if (open == true) {
            setTimeout(() => {
                snackBarAlert(text, type, timeout, false);
            }, timeout);
        }
    }

    const handleNext = () => {
        if (activeStep == 1) {
            if (andresses.name.trim() == "") {
                snackBarAlert("Tên không được để trống!");
                return;
            }
            if (andresses.add.trim() == "") {
                snackBarAlert("Địa chỉ không được để trống!");
                return;
            }
            if (!isNumber(andresses.phone) || andresses.phone.length != 10) {
                snackBarAlert("Số điện thoại không hợp lệ!");
                return;
            }
        }
        if (activeStep == 2) {
            setProductOrder([]);
            setTimeout(() => { history.push("/order") }, 10000);
        }
        setActiveStep(activeStep + 1);

    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    function getStepContent(step) {
        switch (step) {
            case 0:
                return <OrderVerificationForm productOrder={productOrder} setProductOrder={setProductOrder} />
            case 1:
                return <AddressForm snackAlert={snackAlert} setAddresses={setAddresses} andresses={andresses} setAndresses={setAddresses} setLoad={setLoad} />;
            // case 2:
            //     return <PaymentForm payment={payment} setPayment={setPayment} setLoad={setLoad} />;
            case 2:
                return <Review productOrder={productOrder} andresses={andresses} payment={payment} setLoad={setLoad} />;
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
                            <StepLabel>Xác thực đơn hàng</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Địa chỉ giao hàng</StepLabel>
                        </Step>
                        {/* <Step>
                            <StepLabel>Chi tiết thanh toán</StepLabel>
                        </Step> */}
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
                                    Số đơn đặt hàng của bạn là #{Math.floor(Math.random() * Math.floor(999999))}. Chúng tôi sẽ gửi cho bạn thông tin cập nhật khi đơn hàng của bạn đã được giao.
                                </Typography>
                                <Typography variant="subtitle2">
                                    Trang sẽ trở về trang chủ sau 10s...
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