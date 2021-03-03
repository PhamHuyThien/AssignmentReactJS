
import { useEffect, useState } from "react";
import { useRouteMatch, Redirect, useHistory } from "react-router-dom";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { formatMoney, alert, confirm, setTitleWeb} from "../../lib/lib.js";
import Loading from "./Loading.js";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(15),
		marginLeft: theme.spacing(5),
		maxWidth: 600
	}
}));

export default function Account({
	setTitle, guest, setGuest
}) {
	const classes = useStyles();
	const history = useHistory();
	const { url } = useRouteMatch();
    const [load, setLoad] = useState(false);
	useEffect(() => {
		setTitle("Tài khoản");
        setTitleWeb("Tài khoản");
		if (guest.permission == 2) {
			history.push("/login");
		}
        illusionLoading();
	}, []);

    
	const onclickLogoutHandle = (evt) => {
		evt.preventDefault();
        confirm("Đăng xuất?", "Bạn muốn đăng xuất?", "info", ()=>{
            setGuest({ u: "", p: "", name: "", add: "", phone: "", money: "", permission: 2 });
		    history.push("/login");
        });
	}
    const illusionLoading = (time=200)=>{
        setLoad(true);
        setTimeout(()=>{setLoad(false)}, time);
    }
	return (
		<Container component="main" maxWidth="xs">
            <Loading open={load} />
			<Card className={classes.paper} elevation={12}>
				<CardActionArea>
					<CardMedia
						component="img"
						alt="Contemplative Reptile"
						height="250"
						image="https://zicxaphotos.com/wp-content/uploads/2019/09/girl-xinh-cap-3.jpg"
						title="Contemplative Reptile"
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							{guest.name}
						</Typography>
						<Typography variant="body2" color="textSecondary" component="h4">
							Mã số: {guest.id}
						</Typography>
						<Typography variant="body2" color="textSecondary" component="h4">
							Địa chỉ: {guest.add}
						</Typography>
						<Typography variant="body2" color="textSecondary" component="h4">
							Số điện thoại: {guest.phone}
						</Typography>
						<Typography variant="body2" color="textSecondary" component="h4">
							Tài sản: {formatMoney(guest.money) + " VND"}
						</Typography>
						<Typography variant="body2" color="textSecondary" component="h4">
							Quyền hạn: {guest.permission == 0 ? "Quản lý" : "Người dùng"}
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions>
					<Button size="small" color="primary">
						Chỉnh sửa
        </Button>
					<Button size="small" color="primary">
						Đổi mật khẩu
        </Button>
					<Button size="small" variant="contained" color="secondary" onClick={onclickLogoutHandle}>
						Đăng xuất
        </Button>
				</CardActions>
			</Card>
		</Container>
	);
}
