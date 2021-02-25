
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    z: {
        zIndex: 1000,
    },
    progress: {
        color: "#fff"
    }
}));

export default function ({
    open,
}) {
    const classes = useStyles();
    return (
        <Backdrop open={open} className={classes.z} >
            <CircularProgress className={classes.progress} size={80} />
        </Backdrop>
    );
}