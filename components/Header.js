import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {useHistory} from "react-router-dom"
import axios from "axios"
import clsx from "clsx"

import {makeStyles, createMuiTheme, withStyles} from "@material-ui/core/styles"
import {createStyles} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import Modal from '@material-ui/core/Modal'
import CircularProgress from "@material-ui/core/CircularProgress"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import ShoppingCartTwoToneIcon from '@material-ui/icons/ShoppingCartTwoTone'
import Badge from '@material-ui/core/Badge'
import models from "../js/models";
import {addCart, switchShowCartSm} from "../actions/actionCreator";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        height: "100%",
        color: "#BA975F",
        backgroundColor: "#041715",
    },
    basket: {
        fontFamily: "Roboto, sans-serif",
        display: "flex",
        alignSelf: "center",
        border: "1px solid darkslategray",
        borderRadius: "5px",
        color: "#d8c3a4",
        fontSize: "17px",
        height: "35px",
        background: "darkgreen",
        padding: "0 15px",
        fontWeight: 400,
        textTransform: "none",
        "&:hover": {
            background: "darkgreen",
        }
    },
    phone: {
        display: "flex",
        alignSelf: "center",
        textDecoration: "none",
        fontWeight: "normal",
        color: "#BA975F",
        fontSize: "17px",
        lineHeight: "19px",
        height: "18px",
        borderBottom: "1px solid #BA975F",
        margin: "0 30px 0 0",
    },
    phoneXS: {
        color: "#BA975F",
        display: "flex",
        fontSize: "12px",
        textDecoration: "none",
        alignSelf: "center",
        position: "absolute",
        left: "-15px",
    },
    address: {
        position: "absolute",
        display: "flex",
        fontSize: "13.5px",
        fontWeight: "normal",
        color: "#BA975F",
        cursor: "pointer",
        textDecoration: "underline",
        left: 0,
    },
    paper: {
        position: 'absolute',
        width: "1024px",
        height: "608px",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #BA975F',
        boxShadow: theme.shadows[5],
        zIndex: 2
        // padding: theme.spacing(2, 4, 3),
    },
    loader: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: "-12px",
        marginLeft: "-12px",
        color: "#BA975F",
        zIndex: 1,
    },
    cart: {
        color: "#BA975F"
    }
}));

const StyledBadge = withStyles(theme => ({
    badge: {
        top: "20px",
        right: "-6px",
        border: "1px solid #BA975F",
        padding: "3px 3px",
        height: "16px",
        minWidth: "16px",
        zIndex: 1,
        fontSize: "11px",
        background: "#041715",
    },
}))(Badge);

// const rand = () => Math.round(Math.random() * 20) - 10;

const getModalStyle = () => {
    const top = 50; //  + rand()
    const left = 50; // + rand()

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
};

export default function Tea(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    // const history = useHistory();
    // const theme = createMuiTheme({});

    const refresh = useSelector(store => store.app.refresh_cart);
    const show_cart_sm = useSelector(store => store.app.show_cart_sm);

    const [basket, setBasket] = useState([]);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(true);

    const handleWindowControl = () => {
        setOpen(!open);
    };

    const handlerSwitchCartSm = () => {
        dispatch(switchShowCartSm(!show_cart_sm));
    };

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setLoader(false);
            }, 1000);
        } else {
            setLoader(true);
        }
    }, [open]);

    useEffect(() => {
        if(refresh) refreshCart();
    }, [refresh]);

    const refreshCart = () => {

        let openRequest = indexedDB.open('tea', 1);

        openRequest.onsuccess = () => {

            let db = openRequest.result;
            let transaction = db.transaction("products", "readonly");
            let tea = transaction.objectStore("products");
            let products = tea.getAll();
            products.onsuccess = function () {
                console.log(products.result)
                setBasket(products.result)
                dispatch(addCart(products.result))
            };

        };

    };

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <Fragment>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleWindowControl}
            >
                <div style={modalStyle} className={classes.paper}>

                    {
                        loader && <CircularProgress size={34} className={classes.loader}/>
                    }

                    <iframe
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3Aea62e60328eed7ffb0742cd584f5dbef9cdd11c41f77de30404a62f426aaa9bd&amp;source=constructor"
                        width="1016" height="600" frameBorder="0"/>

                </div>
            </Modal>
            <Container maxWidth="lg" className={classes.root}>

                <Hidden only="xs">

                    <div
                        className={classes.address}
                        onClick={handleWindowControl}
                    >
                        Сверд. обл., г. БЕРЕЗОВСКИЙ, ул. Театральная 6
                    </div>

                    <a className={classes.phone} href="tel:+79632733137">+7 (963) 273-31-37</a>

                    <Button className={classes.basket} onClick={handlerSwitchCartSm}>
                        Ваша корзина ({basket.length})
                    </Button>

                </Hidden>

                <Hidden only={['sm', 'lg', 'md', 'xl']}>

                    <a className={classes.phoneXS} href="tel:+79632733137">+7 (963) 273-31-37</a>

                    <IconButton className={classes.cart} onClick={handlerSwitchCartSm}>
                        <StyledBadge badgeContent={basket.length}>
                            <ShoppingCartTwoToneIcon/>
                        </StyledBadge>
                    </IconButton>

                </Hidden>

            </Container>

        </Fragment>
    );
}