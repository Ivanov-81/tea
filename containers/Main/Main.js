import React, { Fragment, useEffect, useState, createRef, Suspense, lazy } from 'react'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import clsx from "clsx"

import { makeStyles, createMuiTheme } from "@material-ui/core/styles"
import { createStyles, Zoom } from "@material-ui/core"
import Hidden from '@material-ui/core/Hidden'
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import CssBaseline from "@material-ui/core/CssBaseline"
import Button from "@material-ui/core/Button"
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CloseIcon from '@material-ui/icons/Close'
import Avatar from '@material-ui/core/Avatar'

import Header from "../../components/Header"
import Line from "../../components/Line"
import Carousel from "../../components/Carousel"
import TableTea from "../../components/TableTea"

import {
    addGroups, refreshCart, switchSubmenu,
    switchShowCart, switchMenu, addCart,
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction,
} from "../../actions/actionCreator"

import Container from "@material-ui/core/Container";
import Popper from "@material-ui/core/Popper";
import Collapse from '@material-ui/core/Collapse';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ThemeProvider } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";

import { REG_EMAIL, SITE_KEY } from "../../js/constants"
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Divider from "@material-ui/core/Divider";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { URL_CAPTCHA, URL_GET_GROUPS, URL_GET_PRODUCTS, URL_ORDERS, URL_SEND_MAIL } from "../../js/Urls";
import Alert from '@material-ui/lab/Alert';
import models from "../../js/models";

const List = lazy(() => import('../../containers/Main/List/List'));
const Menu = lazy(() => import('./Menu/Menu'));
const Cart = lazy(() => import('../../containers/Cart/Cart'));
const Submenu = lazy(() => import('./Submenu/Submenu'));
const ProductOverview = lazy(() => import('../ProductOverview/ProductOverview'));
const Entry = lazy(() => import('../../containers/Admin/Entry/Entry'));

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            position: "initial",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            color: "#000000",
            padding: "55px 23px 55px 23px",
            flexGrow: 1,
            overflow: "hidden",
            [theme.breakpoints.down('lg')]: {
                padding: "55px 23px 55px 23px",
            },
            [theme.breakpoints.down('md')]: {
                padding: "55px 23px 55px 23px",
            },
            [theme.breakpoints.down('sm')]: {
                padding: "55px 23px 20px 23px",
            },
        },
        menu: {
            height: 222,
            backgroundColor: 'rgba(255,255,255,0)',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            minWidth: 186,
            borderRadius: 0,
            padding: 0
        },
        carousel: {
            height: 422,
            backgroundColor: "#EFE6DF",
            border: "1px solid #D5BC9C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            borderRadius: 0,
            [theme.breakpoints.down('lg')]: {
                height: 422,
            },
            [theme.breakpoints.down('md')]: {
                height: 422,
            },
            [theme.breakpoints.down('sm')]: {
                height: 200,
            },
            [theme.breakpoints.down('xs')]: {
                height: 200,
            },
        },
        block: {
            position: "relative",
            display: "flex",
            width: "100%",
            height: 52,
            color: "#BA975F",
            flexDirection: "column",
            backgroundColor: "#041715",
            padding: "0 0 0 23px"
        },
        block2: {
            position: "relative",
            display: "flex",
            width: "100%",
            height: 50,
            color: "#000000",
            flexDirection: "column",
            backgroundColor: "#BA975F",
            padding: "0 0 0 23px"
        },
        block3: {
            position: "relative",
            display: "flex",
            width: "100%",
            color: "#000000",
            flexDirection: "column",
            backgroundImage: "url(../images/fone.jpg)",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            minHeight: "calc(100vh - 102px)",
        },
        link: {
            position: "fixed",
            top: "110px",
            right: "25px",
            color: "#031715",
            zIndex: 1,
            fontSize: "13px",
        },
        item: {
            display: "flex",
            justifyContent: "space-between",
            textTransform: "none",
            width: "100%",
            height: "37px",
            borderBottom: "1px solid #D5BC9C",
            borderRight: "1px solid #D5BC9C",
            backgroundColor: "#EFE6DF",
            fontSize: "15px",
            fontWeight: 400,
            color: "#815333",
            borderRadius: 0,
            padding: "0 20px",
            "&:hover": {
                color: "#815333",
                backgroundColor: "#EFE6DF",
            },
            "& .MuiButton-label": {
                height: "100%",
            }
        },
        chevron: {
            display: "flex",
            padding: "2px",
            color: "#D5BC9C",
        },
        name: {
            display: "flex",
            alignItems: "center",
        },
        span: {
            overflow: "hidden",
            textAlign: "left",
        },
        popper: {
            // left: "-10px !important"
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: "#EFE6DF",
            border: '2px solid #041715',
            boxShadow: theme.shadows[5],
            padding: "15px",
            opacity: "1 !important",
            visibility: "visible !important",
            width: 600,
            height: 550,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            [theme.breakpoints.down('sm')]: {
                width: '98%'
            },
            [theme.breakpoints.down('xs')]: {
                width: '98%'
            },
        },
        paper2: {
            width: 885,
            height: 600,
            backgroundColor: "#EFE6DF",
            borderRadius: "0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            [theme.breakpoints.down('sm')]: {
                width: '98%',
            },
            [theme.breakpoints.down('xs')]: {
                width: '98%',
            },
        },
        cart: {
            overflow: "hidden"
        },
        container: {
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            top: "-54px",
            right: "10px",
            width: "350px",
            height: "350px",
            [theme.breakpoints.down('lg')]: {},
            [theme.breakpoints.down('md')]: {},
            [theme.breakpoints.down('sm')]: {
                top: "50px",
                right: "50%",
                marginRight: "-175px"
            },
        },
        closeModal: {
            position: "absolute",
            right: 0,
            color: "#ff0000",
        },
        delProd: {
            position: "absolute",
            top: 0,
            right: 0,
            color: "#ff0000",
            [theme.breakpoints.down('sm')]: {
                right: -13
            },
        },
        header: {
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "36px",
            fontSize: "18px",
            color: "#041715",
        },
        body: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            height: "430px",
        },
        footer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
            height: "45px"
        },
        button: {
            color: "darkgreen",
            border: "1px solid darkgreen",
            padding: "5px 10px",
            fontSize: "14px",
            textTransform: "none",
            backgroundColor: "#d8c3a4",
            height: "37px",
            width: "150px",
        },
        progress: {
            width: '100%',
            '& div': {
                backgroundColor: 'rgb(232, 240, 254)',
                '& div': {
                    backgroundColor: '#008000'
                }
            },
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
        progressInfo: {
            width: "100%",
            height: "15px",
            display: "flex",
            justifyContent: "space-around",
            fontSize: "12px",
        },
        progressAction: {
            width: "33.3%",
            textAlign: "center",
            color: "#666666",
        },
        bodyForm: {
            marginTop: "10px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            [theme.breakpoints.down('sm')]: {
                marginTop: "0px",
            },
            [theme.breakpoints.down('xs')]: {
                marginTop: "0px",
            }
        },
        bF: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
        },
        bF2: {
            width: "100%",
            height: "330px",
            minHeight: "120px",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            overflowY: "auto",
        },
        phone: {
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "14px",
            display: "flex",
            alignItems: "center",
            color: "#000000",
            margin: "20px 0 0 0",
            [theme.breakpoints.down('sm')]: {
                marginTop: "10px",
            },
            [theme.breakpoints.down('xs')]: {
                marginTop: "10px",
            },
        },
        input: {
            margin: "5px 0 0 0",
            color: "#879196",
            width: "200px",
            "& div": {
                height: "35px",
                "& input": {
                    padding: "0px 10px"
                }
            },
            "& p": {
                fontSize: "14px",
                margin: "1px 3px 0 -5px",
                // [theme.breakpoints.down('lg')]: {
                //     fontSize: "14px",
                //     margin: "0 0 0 -5px",
                // },
                // [theme.breakpoints.down('md')]: {
                //     fontSize: "12px",
                //     margin: "0 0 0 -5px",
                // },
                // [theme.breakpoints.down('sm')]: {
                //     fontSize: "11px",
                //     margin: "0 0 0 -5px",
                // },
            },
            "& input": {
                margin: "1px 3px 0 0",
                height: "35px",
                fontSize: "14px",
            },
            "& p.Mui-error": {
                position: "absolute",
                top: "26px",
                fontSize: "11px",
                margin: "0 0 0 9px",
                background: "#EFE6DF",
                padding: "0 5px",
            },
            // [theme.breakpoints.down('lg')]: {
            //     margin: "2px 0 0 0",
            //     "& input": {
            //         padding: "10px 10px",
            //         fontSize: "14px",
            //         height: "19px",
            //     },
            //     "& p.Mui-error": {
            //         top: "28px",
            //         fontSize: "11px",
            //     },
            // },
            // [theme.breakpoints.down('md')]: {
            //     margin: "2px 0 0 0",
            //     "& input": {
            //         padding: "5px 5px",
            //         fontSize: "13px",
            //         height: "28px",
            //     },
            //     "& p.Mui-error": {
            //         top: "30px",
            //         fontSize: "10px",
            //         height: "10px",
            //     },
            // },
            // [theme.breakpoints.down('sm')]: {
            //     margin: "2px 0 0 0",
            //     "& input": {
            //         padding: "3px 3px",
            //         fontSize: "13px",
            //         height: "24px",
            //     },
            //     "& p.Mui-error": {
            //         top: "26px",
            //         fontSize: "10px",
            //         height: "10px",
            //     },
            // },
        },
        captcha: {
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px 0 0 0",
            width: "200px",
            height: "55px",
            borderRadius: "4px",
            border: "1px solid #BBB",
            "&:hover": {
                margin: "20px 0 0 0",
                border: "1px solid blue",
                width: "200px",
                height: "55px",
            }
        },
        checkbox: {
            cursor: "pointer",
            width: "24px",
            height: "24px",
            margin: "0 20px",
        },
        loader: {
            position: "absolute",
            top: "12px",
            left: "17px",
        },
        delivery: {
            width: "35%",
            padding: "10px",
        },
        pickup: {
            width: "65%",
            padding: "10px",
            position: "relative"
        },
        fone: {
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
        },
        checkboxDeliv: {
            width: "100%",
            height: "40px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            cursor: "pointer",
        },
        formControl: {
            width: "60%",
            height: "35px",
            margin: "10px 0 0 0",
            "& div": {
                height: "35px",
                "& div": {
                    height: "23px",
                    padding: "8px 22px 5px 15px",
                    fontSize: "14px",
                }
            }
        },
        fC1: {},
        textarea: {
            color: "#879196",
            width: "90%",
            height: "150px !important",
            margin: "5px 0 0 0",
            fontSize: "13px",
            border: "1px solid #BBB",
            borderRadius: "4px",
            background: "#EFE6DF",
            padding: "5px 10px",
            outline: "none",
            [theme.breakpoints.down('sm')]: {
                height: "50px !important",
            },
            [theme.breakpoints.down('xs')]: {
                height: "50px !important",
            },
        },
        inputArea: {
            color: "#879196",
            width: "90%",
            margin: "5px 0 0 0",
            "& div": {
                "& input": {
                    padding: "9px 10px"
                },
                height: "35px",
                fontSize: "14px"
            },
            "& p": {
                fontSize: "14px",
                margin: "1px 3px 0 -5px",
                // [theme.breakpoints.down('lg')]: {
                //     fontSize: "14px",
                //     margin: "0 0 0 -5px",
                // },
                // [theme.breakpoints.down('md')]: {
                //     fontSize: "12px",
                //     margin: "0 0 0 -5px",
                // },
                // [theme.breakpoints.down('sm')]: {
                //     fontSize: "11px",
                //     margin: "0 0 0 -5px",
                // },
            },
            "&input": {
                margin: "1px 3px 0 0",
                height: "35px",
                fontSize: "14px",
            },
            "& p.Mui-error": {
                height: "10px",
                position: "absolute",
                top: "26px",
                fontSize: "11px",
                margin: "0 0 0 9px",
                background: "#EFE6DF",
                padding: "0 5px",
            },
            // [theme.breakpoints.down('lg')]: {
            //     margin: "2px 0 0 0",
            //     "& input": {
            //         padding: "10px 10px",
            //         fontSize: "14px",
            //         height: "19px",
            //     },
            //     "& p.Mui-error": {
            //         top: "28px",
            //         fontSize: "11px",
            //     },
            // },
            // [theme.breakpoints.down('md')]: {
            //     margin: "2px 0 0 0",
            //     "& input": {
            //         padding: "5px 5px",
            //         fontSize: "13px",
            //         height: "28px",
            //     },
            //     "& p.Mui-error": {
            //         top: "30px",
            //         fontSize: "10px",
            //         height: "10px",
            //     },
            // },
            // [theme.breakpoints.down('sm')]: {
            //     margin: "2px 0 0 0",
            //     "& input": {
            //         padding: "3px 3px",
            //         fontSize: "13px",
            //         height: "24px",
            //     },
            //     "& p.Mui-error": {
            //         top: "26px",
            //         fontSize: "10px",
            //         height: "10px",
            //     },
            // },
        },
        news: {
            position: "relative",
            display: "flex",
            margin: "10px 0 0 0",
            borderRadius: 0,
            height: 222,
            minWidth: 186,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "flex-start",
            backgroundColor: '#092924',
        },
        news2: {
            margin: "15px 0 0 0",
        },
        titleNews: {
            textAlign: "center",
            position: "relative",
            top: 20,
            zIndex: 9,
            fontWeight: 600,
            fontSize: "15px",
            color: "#A58A58",
            padding: "0 0 0 0",
            margin: "0 0 0 0",
        },
        newsBody: {
            position: "absolute",
            top: "10px",
            right: "10px",
            bottom: "10px",
            left: "10px",
            backgroundColor: "#092924",
            borderLeft: "2px solid #A58A58",
            borderTop: "1px solid #A58A58",
            borderBottom: "1px solid #A58A58",
            borderRight: "1px solid #A58A58",
            padding: "30px 0 0 0",
            overflowX: "hidden",
            overflowY: "auto",
        },
        email: {
            height: 120,
            // backgroundColor: "inherit",
        },
        titleEmail: {
            top: "7px",
            color: "#092924",
            margin: "0 0 10px 0",
            padding: 0,
            zIndex: 9,
            position: "relative",
            fontSize: "15px",
            textAlign: "center",
            fontWeight: 600,
            display: "flex",
            flexDirection: "column",
        },
        buttonInputBlock: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        emailBody: {
            position: "absolute",
            top: "10px",
            right: "10px",
            bottom: "10px",
            left: "10px",
            backgroundColor: "#A58A58",
            padding: "0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
        },
        emailBody2: {
            position: "absolute",
            top: "10px",
            right: "10px",
            bottom: "10px",
            left: "10px",
            backgroundColor: "#A58A58",
            padding: "0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            border: "1px solid #092924",
        },
        inputEmail: {
            height: "100%",
            border: 0,
            background: "#D8C3A4",
            padding: "0 12px",
        },
        buttonEmail: {
            padding: "6px 24px",
            border: "1px solid #D8C3A4",
            borderRadius: 0
        },
        recipe: {
            position: "relative",
            marginTop: "16px",
            width: "100%",
            height: 327,
            backgroundColor: "#092924",
            borderRadius: 0,
            [theme.breakpoints.down('lg')]: {
                height: 327,
            },
            [theme.breakpoints.down('md')]: {
                height: 327,
            },
            [theme.breakpoints.down('sm')]: {
                height: 245,
            },
        },
        productCart: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "120px",
            minHeight: "120px",
            borderBottom: "1px solid #ddd",
            justifyContent: "flex-start",
            alignItems: "center",
            position: "relative"
        },
        rounded: {
            width: "100px",
            height: "100px"
        },
        desc: {
            width: "80%",
            height: "100%",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            [theme.breakpoints.down('sm')]: {
                width: '74%'
            },
            [theme.breakpoints.down('xs')]: {
                width: '74%'
            }
        },
        descSpan: {
            width: "calc(100% - 20px)",
            height: "20px",
            minHeight: "20px",
            fontWeight: 500,
            textAlign: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            marginRight: "20px",
        },
        descDiv: {
            width: "100%",
            height: "55%",
            fontSize: "13px",
            textAlign: "left",
            color: "#555",
            overflow: "hidden",
            whiteSpace: "pre-wrap",
            textOverflow: "ellipsis",
            minHeight: 51
        },
        inputDiv: {},
        infoInput: {
            width: "60px",
            height: "20px",
            textAlign: "center",
        },
        amount: {
            fontWeight: 500,
            width: "100%",
            textAlign: "center",
            marginTop: "15px",
        },
        loaderSend: {
            position: "absolute",
            color: "darkgreen",
        },
        result: {
            marginTop: 10
        },
        wrapper: {
            position: "relative",
            width: 800,
            height: 650,
            backgroundColor: "#092924",
            boxShadow: "0px 4px 10px 0px rgba(255,255,255,0.25), 1px -5px 8px 0px rgba(255,255,255,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
            padding: theme.spacing(2, 4, 3),
            outline: "none",
            [theme.breakpoints.down('xl')]: {
                width: 800,
                height: 650,
            },
            [theme.breakpoints.down('lg')]: {
                width: 800,
                height: 650,
            },
            [theme.breakpoints.down('md')]: {
                width: 800,
                height: 650,
            },
            [theme.breakpoints.down('sm')]: {
                width: '96%',
                height: '98%',
            },
            [theme.breakpoints.down('xs')]: {
                width: '96%',
                height: '98%',
            },
        },
    })
);

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

function Main() {

    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = createMuiTheme({});

    let target = createRef();

    const steps = [
        {
            label: '1. Сверд. обл., г. Верхняя Пышма. ул. Машиностроителей, 7',
            imgPath: '../images/pic_05.jpg',
        }
    ];

    const cart = useSelector(store => store.catalogs.cart);
    const groups = useSelector(store => store.catalogs.groups);
    const show_cart = useSelector(store => store.app.show_cart);
    const show_cart_sm = useSelector(store => store.app.show_cart_sm);
    const open_menu = useSelector(store => store.app.open_menu);
    const open_submenu = useSelector(store => store.app.open_submenu);

    const [anchor, setAnchor] = useState(null);
    const [sum, setSum] = useState(0);
    const [alert, setAlert] = useState({"cls": "success", "text": "Заказ оформлен"});
    const [title, setTitle] = useState("");
    const [object, setObject] = useState({});
    const [data_menu, setDataMenu] = useState({
        id: "root",
        name: "Меню",
        children: []
    });
    const [data_submenu, setDataSubmenu] = useState({});

    const [item, setItem] = useState({});
    const [sub_groups, setSubgroups] = useState([]);
    const [products, setProducts] = useState([]);

    const [open, setOpen] = useState(false);
    const [entry_modal, setEntryModal] = useState(false);
    const [open_two, setOpenTwo] = useState(false);
    const [product, setProduct] = useState(false);
    const [open_modal, setOpenModal] = useState(false);
    const [completed, setCompleted] = useState(0);
    const [progress, setProgress] = useState(0);
    const [completed_dis, setCompletedDis] = useState(true);
    const [next, setNext] = useState("Далее");
    const [completed_next, setCompletedNext] = useState(false);
    const [loader_send_data, setLoaderSendData] = useState(false);
    const [show_message, setShowMessage] = useState(false);

    const [checked, setChecked] = useState(false);
    const [status_checked, setStatusChecked] = useState(false);

    const [phone, setPhone] = useState("");
    const [errorPhone, setErrorPhone] = useState(false);
    const [helperTextPhone, setHelperTextPhone] = useState("");

    const [name, setName] = useState("");
    const [errorName, setErrorName] = useState(false);
    const [helperTextName, setHelperTextName] = useState("");

    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [helperTextEmail, setHelperTextEmail] = useState("");

    const [captcha, setCaptcha] = useState(null);
    const [checked_loader, setCheckedLoader] = useState(false);

    const [description, setDescription] = useState("");

    const [address, setAddress] = useState("");
    const [errorAddress, setErrorAddress] = useState(false);
    const [helperAddress, setHelperAddress] = useState("");

    const [default_address, setDefaultAddress] = useState("г. Верхняя Пышма. ул. Машиностроителей, 7");
    const [delivery, setDelivery] = useState({
        bool: false,
        address: "г. Верхняя Пышма. ул. Машиностроителей, 7"
    });
    const [city, setCity] = useState("Берёзовский");
    const [cities] = useState([
        {id: "Берёзовский", name: "Берёзовский"},
        {id: "Екатеринбург", name: "Екатеринбург"},
        {id: "Верхняя Пышма", name: "Верхняя Пышма"},
        {id: "Среднеуральск", name: "Среднеуральск"}
    ]);

    const [modalStyle] = React.useState(getModalStyle);

    const handleChangeTextArea = (e) => {
        setDescription(e.target.value)
    }

    const handleChangeAddress = (e) => {
        setAddress(e.target.value)
    };

    const handleFocusAddress = (e) => {
        setErrorAddress(false)
        setHelperAddress("")
    };

    const handlerChangeCity = (e) => {
        setCity(e.target.value)
    };

    const handlerGetProducts = (item) => (e) => {
        e.stopPropagation();

        let elem = document.getElementsByClassName("border-right-zero")[0]

        if (elem) {
            elem.classList.remove("border-right-zero");
        }

        let parent = e.target.offsetParent
        parent.classList.add("border-right-zero")

        if (!open) {
            setAnchor(target.current);
            setOpen(true);
        }

        setItem(item);

    };

    const enqueueSnackbar = (...args) => {
        dispatch(enqueueSnackbarAction(...args))
    };

    const closeSnackbar = (...args) => {
        dispatch(closeSnackbarAction(...args));
    };

    const closeList = (data) => {
        setOpen(data);
    };

    const entry = () => {
        setEntryModal(true);
    };

    const changeEntry = (data) => {
        setEntryModal(data);
    };

    const handlerCheckDelivery = () => {
        if (delivery.bool) {
            setDelivery({bool: false, address: ""});
            setAddress("");
        } else {
            setAddress("");
            setDelivery({bool: true, address: ""});
            setAddress(default_address);
            setCity("Верхняя Пышма");
        }
    };

    const handleChangeInputText = (e) => {

        switch (e.target.name) {

            case "name": {
                setName(e.target.value);
                break;
            }
            case "phone": {
                setPhone(e.target.value.replace(/[^\d]/g, ''));
                break;
            }
            case "email": {
                setEmail(e.target.value);
                break;
            }
            default: {
            }

        }

    };

    const saveOrder = (object) => {

        object["data"] = JSON.stringify(object.products)
        object["date"] = new Date()

        axios.post(URL_ORDERS, object)

    }

    const clearFields = () => {

        setName("")
        setPhone("")
        setEmail("")

        setStatusChecked(false);
        setCheckedLoader(false);

        setNext("Далее");

        let openRequest = indexedDB.open('tea', 1);
        openRequest.onsuccess = () => {
            let db = openRequest.result;
            // При успешном открытии вызвали коллбэк передав ему объект БД
            let transaction = db.transaction("products", "readwrite");
            transaction.objectStore('products').clear();
            let tea = transaction.objectStore("products");
            let products = tea.getAll();
            products.onsuccess = () => {
                if (products.result.length === 0) {
                    dispatch(refreshCart(true));
                    setTimeout(() => {
                        dispatch(refreshCart(false));
                    }, 500);
                }
            }
        };
    };

    const handleFocusInputText = (e) => {

        switch (e.target.name) {

            case "name": {
                setErrorName(false);
                setHelperTextName("");
                break;
            }
            case "phone": {
                setErrorPhone(false);
                setHelperTextPhone("");
                break;
            }
            case "email": {
                setErrorEmail(false);
                setHelperTextEmail("");
                break;
            }
            default: {
            }

        }

    };

    const handlerCheckRobot = () => {

        if (!status_checked) {
            setCheckedLoader(true);
            axios.post(URL_CAPTCHA, {key: SITE_KEY})
                .then((result) => {
                    const {status, data} = result;
                    if (status === 200) {

                        if (data.result) {
                            setTimeout(() => {
                                setCaptcha(data.data.captcha)
                                setStatusChecked(true)
                                setCheckedLoader(false);
                            }, 3000)
                        } else {
                            enqueueSnackbar({
                                message: data.reason,
                                options: {
                                    key: new Date().getTime() + Math.random(),
                                    variant: 'error',
                                    action: (key) => (
                                        <Button onClick={() => closeSnackbar(key)}>
                                            <CloseIcon/>
                                        </Button>
                                    ),
                                },
                            });
                        }
                    }
                })
                .catch(error => {

                });
        }

    };

    const sendData = () => {

        if (captcha === null || captcha === undefined) {
            enqueueSnackbar({
                message: "Подтвердите что вы не робот!",
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'warning',
                    action: (key) => (
                        <Button onClick={() => closeSnackbar(key)}>
                            <CloseIcon/>
                        </Button>
                    ),
                },
            });
            return
        }

        if (name === "") {
            setErrorName(true);
            setHelperTextName("Вы не представились!");
            return
        }

        if (name.length < 2) {
            setErrorName(true);
            setHelperTextName("Странное имя у Вас!");
            return
        }

        if (phone === "") {
            setErrorPhone(true);
            setHelperTextPhone("Введите Номер телефона");
            return
        }

        if (phone.length < 10) {
            setErrorPhone(true);
            setHelperTextPhone("Введите 10 цифр");
            return
        }

        if (email === "") {
            setErrorEmail(true);
            setHelperTextEmail("Введите E-mail");
            return
        } else {

            if (REG_EMAIL.test(email) === false) {
                setErrorEmail(true);
                setHelperTextEmail("Введите корректный E-mail");
                return false;
            }
        }

        setLoaderSendData(true);
        setCompletedNext(true);
        setCompletedDis(true);

        let object = {
            "order": `ЧЖ-${new Date().getTime() + Math.random()}`,
            "address": `${city} ${address}`,
            "description": description,
            "delivery": (delivery.bool) ? `Доставка: ${address}` : `Самовывоз: ${default_address}`,
            "name": name,
            "phone": "+7" + phone,
            "phone_template": "+7 (" + phone.substring(0, 3) + ") " + phone.substring(3, 6) + "-" + phone.substring(6, 8) + "-" + phone.slice(8),
            "email": email,
            "captcha": captcha,
        }

        let openRequest = indexedDB.open('tea', 1);
        openRequest.onsuccess = () => {
            let db = openRequest.result;
            // При успешном открытии вызвали коллбэк передав ему объект БД
            let transaction = db.transaction("products", "readonly");
            let tea = transaction.objectStore("products");
            let products = tea.getAll();
            products.onsuccess = function () {

                object['products'] = products.result;
                object['SMTPDebug'] = 0;

                axios.post(URL_SEND_MAIL, object)
                    .then((result) => {
                        const {status, data, statusText} = result;
                        if (status === 200) {
                            if (data === "OK") {
                                setTitle("Заказ оформлен");
                                setAlert({"cls": "success", "text": "Заказ оформлен"});
                                enqueueSnackbar({
                                    message: "Заявка отправлена!",
                                    options: {
                                        key: new Date().getTime() + Math.random(),
                                        variant: 'success',
                                        action: (key) => (
                                            <Button onClick={() => closeSnackbar(key)}>
                                                <CloseIcon/>
                                            </Button>
                                        ),
                                    },
                                });

                                setTimeout(() => {
                                    closeModal()
                                    clearFields()
                                    saveOrder(object)
                                    setShowMessage(!show_message)
                                }, 3000)

                            } else {
                                setTitle(data);
                                setAlert({"cls": "error", "text": "Произошла ошибка. Сообщение не было отправлено."});
                                enqueueSnackbar({
                                    message: data,
                                    options: {
                                        key: new Date().getTime() + Math.random(),
                                        variant: 'error',
                                        action: (key) => (
                                            <Button onClick={() => closeSnackbar(key)}>
                                                <CloseIcon/>
                                            </Button>
                                        ),
                                    },
                                });
                            }
                        }
                    })
                    .catch(error => {

                    })
                    .finally(() => {
                        setShowMessage(true);
                        setLoaderSendData(false);
                        setCompletedNext(false);
                        setCompletedDis(false);
                    });

            };

            products.onerror = () => {
                setLoaderSendData(false);
                setCompletedNext(false);
                setCompletedDis(false);
            }
        };
        openRequest.onerror = () => {
            setLoaderSendData(false);
            setCompletedNext(false);
            setCompletedDis(false);
        }
    };

    const addStep = () => {

        if (completed < 2) {
            let number = completed + 1

            if (number === 1) {
                setCompleted(number)
            }

            if (number === 2) {
                if (address === "") {
                    setErrorAddress(true)
                    setHelperAddress("Введите адрес")
                    return
                } else {
                    setCompleted(number)
                }
            }

            if (number === 1) {
                setCompletedDis(false);
                setCompletedNext(false);
                setNext("Далее");
                setProgress(66.6);
            }

            if (number === 2) {
                setNext("Отправить");
                setProgress(100);
            }

        }

        if (completed === 2) sendData();

    };

    const backStep = () => {

        if (completed > 0) {
            let number = completed - 1
            setCompleted(number)

            if (number === 0) {
                setCompletedDis(true);
                setProgress(33.3);
            }

            if (number === 1) {
                setCompletedDis(false);
                setCompletedNext(false);
                setNext("Далее");
                setProgress(66.6);
            }

            if (number === 2) {
                setCompletedNext(true);
                setNext("Отправить");
                setProgress(100);
            }

        }

    };

    const closeModal = () => {
        dispatch(switchShowCart(false))
        setCompleted(0);
        setProgress(0);
        setCompletedDis(true);
        onHideModal();
    }

    const deleteProductInCart = (item) => {

        let openRequest = indexedDB.open('tea', 1);
        openRequest.onsuccess = () => {
            let db = openRequest.result;
            // При успешном открытии вызвали коллбэк передав ему объект БД
            let transaction = db.transaction("products", "readwrite");
            let tea = transaction.objectStore("products");
            let products = tea.getKey(`${item.id}`);
            products.onsuccess = function () {
                tea.delete(products.result)
                dispatch(refreshCart(true))
                setTimeout(() => {
                    dispatch(refreshCart(false))
                }, 500)
            }
        }

    }

    const changeItem = (item) => {
        let openRequest = indexedDB.open('tea', 1);
        openRequest.onsuccess = () => {
            let db = openRequest.result;
            // При успешном открытии вызвали коллбэк передав ему объект БД
            let transaction = db.transaction("products", "readwrite");
            let tea = transaction.objectStore("products");
            let products = tea.getKey(`${item.id}`);
            products.onsuccess = function () {
                tea.put(item, products.result)
            }
        }
    }

    const minusProduct = (e, elem, item) => {
        let val = elem.value,
            sm = sum;
        if (Number(elem.value) > Number(item.price)) {
            sm = sm - Number(item.price)
            elem.value = Number(val) - Number(item.price)
            item["amount"] = elem.value
            changeItem(item)
            setSum(sm)
        }
    }

    const plusProduct = (e, elem, item) => {
        let val = elem.value,
            sm = sum;
        sm = sm + Number(item.price)
        elem.value = Number(val) + Number(item.price)
        item["amount"] = elem.value
        changeItem(item)
        setSum(sm)
    }

    const body = (
        <div className={classes.paper}>
            <div
                id="transition-modal-title"
                className={classes.header}
            >
                Оформление заказа

                <IconButton
                    aria-label="close"
                    className={classes.closeModal}
                    onClick={closeModal}
                >
                    <CloseIcon style={{fontSize: "1.1rem"}}/>
                </IconButton>

            </div>
            <div
                id="transition-modal-description"
                className={classes.body}
            >
                <div className={classes.progress}>
                    <LinearProgress variant="determinate" value={progress}/>
                </div>
                <div className={classes.progressInfo}>
                    <div className={classes.progressAction}>Проверка товаров</div>
                    <div className={classes.progressAction}>
                        {
                            (completed === 1 || completed === 2) &&
                            "Ввод данных"
                        }
                    </div>
                    <div className={classes.progressAction}>
                        {
                            completed === 2 &&
                            "Оформление доставки"
                        }
                    </div>
                </div>
                <div className={classes.amount}>Заказ на сумму: {sum} ₽</div>
                <div className={classes.bodyForm}>
                    {
                        (completed === 0) &&
                        <section className={classes.bF2}>
                            {
                                cart &&
                                cart.map((item, index) => {

                                    const ref = React.createRef()

                                    let ph = item.photo.split("/")
                                    if (ph[0] === "..") {
                                        ph = ph[2] + "/" + ph[3] + "/" + ph[4]
                                    } else {
                                        ph = ph.join("/")
                                    }

                                    return <div key={index} className={classes.productCart}>

                                        <IconButton
                                            aria-label="close"
                                            className={classes.delProd}
                                            onClick={() => deleteProductInCart(item)}
                                        >
                                            <CloseIcon style={{fontSize: "1.1rem"}}/>
                                        </IconButton>

                                        <Avatar variant="rounded" className={classes.rounded} src={ph}/>

                                        <div className={classes.desc}>
                                            <span title={item.name.split('"').join('`')} className={classes.descSpan}>
                                                {item.name}
                                            </span>
                                            <div
                                                title={item.description && item.description.split('"').join('`')}
                                                className={classes.descDiv}
                                            >
                                                {item.description}
                                            </div>
                                            <Divider/>
                                            <div className={classes.inputDiv}>
                                                <IconButton
                                                    aria-label="delete"
                                                    className={classes.productButton}
                                                    onClick={(e) => minusProduct(e, ref.current, item)}
                                                >
                                                    <RemoveIcon style={{fontSize: "1.1rem"}}/>
                                                </IconButton>
                                                <input
                                                    ref={ref}
                                                    className={classes.infoInput}
                                                    value={item.amount}
                                                    data-price={item.price}
                                                /> ₽
                                                <IconButton
                                                    aria-label="delete"
                                                    className={classes.productButton}
                                                    onClick={(e) => plusProduct(e, ref.current, item)}
                                                >
                                                    <AddIcon style={{fontSize: "1.1rem"}}/>
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </section>
                    }
                    {
                        (completed === 1) &&
                        <Grid container spacing={0} className={classes.bF}>
                            <Grid item xs={12} sm={6} className={classes.delivery}>
                                <div className={classes.checkboxDeliv} onClick={handlerCheckDelivery}>
                                    {
                                        !delivery.bool ? <CheckBox style={{color: "green"}}/> : <CheckBoxOutlineBlank/>
                                    }
                                    <span style={{marginLeft: "10px"}}>Доставка</span>
                                </div>
                                <div className={classes.checkboxDeliv} onClick={handlerCheckDelivery}>
                                    {
                                        delivery.bool ? <CheckBox style={{color: "green"}}/> : <CheckBoxOutlineBlank/>
                                    }
                                    <span style={{marginLeft: "10px"}}>Самовывоз</span>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} className={classes.pickup}>

                                {
                                    delivery.bool && <div className={classes.fone}/>
                                }

                                <div className={classes.phone} style={{margin: "14px 0 0 0"}}>Город</div>

                                <FormControl variant="outlined" className={clsx(classes.formControl, classes.fC1)}
                                             disabled={delivery.bool}>
                                    <Select
                                        value={city}
                                        onChange={handlerChangeCity}
                                    >
                                        <MenuItem value="null">
                                            <em className={classes.em}>Город</em>
                                        </MenuItem>
                                        {
                                            cities.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>

                                <div className={classes.phone} style={{margin: "14px 0 0 0"}}>Адрес</div>

                                <ThemeProvider theme={theme}>
                                    <TextField
                                        error={errorAddress}
                                        helperText={helperAddress}
                                        placeholder="Ленина 31 д.5/2 кв.385"
                                        name="address"
                                        type="text"
                                        value={address}
                                        className={clsx(classes.inputArea)}
                                        margin="normal"
                                        variant="outlined"
                                        onChange={handleChangeAddress}
                                        onFocus={handleFocusAddress}
                                        autoComplete="off"
                                        disabled={delivery.bool}
                                        InputProps={{
                                            inputProps: {
                                                maxLength: 100,
                                            },
                                        }}

                                    />
                                </ThemeProvider>

                                <div className={classes.phone} style={{margin: "14px 0 0 0"}}>Заметка</div>

                                <TextareaAutosize
                                    rowsMax={4}
                                    aria-label="maximum height"
                                    placeholder="Пожелания по заказу"
                                    value={description}
                                    className={classes.textarea}
                                    disabled={delivery.bool}
                                    name="description"
                                    onChange={handleChangeTextArea}
                                />

                            </Grid>
                        </Grid>
                    }
                    {
                        (completed === 2) &&
                        <Fragment>

                            <div className={classes.phone}>Представтесь пожалуйста</div>
                            <ThemeProvider theme={theme}>
                                <TextField
                                    error={errorName}
                                    helperText={helperTextName}
                                    placeholder="Марина Петровна"
                                    name="name"
                                    type="text"
                                    value={name}
                                    className={clsx(classes.input)}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={handleChangeInputText}
                                    onFocus={handleFocusInputText}
                                    autoComplete="off"
                                    InputProps={{
                                        inputProps: {
                                            maxLength: 50,
                                        },
                                    }}

                                />
                            </ThemeProvider>

                            <div className={classes.phone}>Номер телефона</div>
                            <ThemeProvider theme={theme}>
                                <TextField
                                    error={errorPhone}
                                    name="phone"
                                    placeholder=""
                                    value={phone}
                                    helperText={helperTextPhone}
                                    className={clsx(classes.input)}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={handleChangeInputText}
                                    onFocus={handleFocusInputText}
                                    InputProps={{
                                        inputProps: {maxLength: 10},
                                        startAdornment: <InputAdornment position="start">+7</InputAdornment>,
                                    }}
                                    autoComplete="off"
                                />
                            </ThemeProvider>

                            <div className={classes.phone}>E-mail</div>
                            <ThemeProvider theme={theme}>
                                <TextField
                                    error={errorEmail}
                                    helperText={helperTextEmail}
                                    placeholder="example@example.com"
                                    name="email"
                                    type="text"
                                    value={email}
                                    className={clsx(classes.input)}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={handleChangeInputText}
                                    onFocus={handleFocusInputText}
                                    autoComplete="off"
                                    InputProps={{
                                        inputProps: {
                                            maxLength: 50,
                                        },
                                    }}

                                />
                            </ThemeProvider>

                            <div className={classes.captcha}>
                                <div className={classes.checkbox} onClick={handlerCheckRobot}>
                                    {
                                        status_checked ? <CheckBox style={{color: "green"}}/> : <CheckBoxOutlineBlank/>
                                    }
                                    {
                                        checked_loader && <CircularProgress size={30} className={classes.loader}/>
                                    }
                                </div>
                                <span style={{lineHeight: "17px"}}>Подтвердите что вы не робот</span>
                            </div>

                            <Zoom in={show_message}>
                                <Alert title={title} severity={alert.cls} className={classes.result}>
                                    {alert.text}
                                </Alert>
                            </Zoom>

                        </Fragment>
                    }
                </div>
            </div>
            <div className={classes.footer}>
                <Button
                    className={classes.button}
                    onClick={backStep}
                    disabled={completed_dis}
                >
                    Назад
                </Button>
                <Button
                    className={classes.button}
                    onClick={addStep}
                    disabled={completed_next}
                >
                    {next}
                    {
                        loader_send_data && <CircularProgress size={20} className={classes.loaderSend}/>
                    }
                </Button>
            </div>
        </div>
    );

    const endListener = (element, func) => {
        // console.log(element);
        // console.log(func);
    };

    const closeWindow = (e) => {
        if (open) setOpen(false);
    };

    const changeWindowState = () => {
        dispatch(switchMenu(!open_menu));
    }

    const changeSubWindowState = (bool, data) => {
        dispatch(switchMenu(!bool));
        dispatch(switchSubmenu(bool));
        if (data) setDataSubmenu(data);
    }

    const onHideModal = () => {
        setAlert({"cls": "success", "text": "Заказ оформлен"});
        setShowMessage(false);
        dispatch(switchShowCart(false));
        clearData();
    }

    const clearData = () => {
        setDelivery({bool: false, address: "г. Верхняя Пышма. ул. Машиностроителей, 7"});
        setCity("Верхняя Пышма");
        setPhone("");
        setName("");
        setEmail("");
        setCaptcha(null);
        setDescription("");
        setAddress("");
        setCompleted(0);
        setNext("Далее");
        setCompletedNext(false);
        setCompletedDis(true);
        setStatusChecked(false);
    }

    const createObject = (obj) => {

        let o = {};
        o[0] = {count: obj.children.length + 1}
        obj.children.forEach((val, key) => {
            o[(key + 1)] = {count: (val.children.length + o[key].count)}
        })
        setObject(o)
        setDataMenu(obj)
    }

    const handleClose = () => {
        setOpenTwo(false);
    };

    const stateWindow = (data) => {
        setOpenTwo(data);
    };

    const handlerShowProduct = (product) => {
        setProduct(product);
        handleOpen();
    };

    const handleOpen = () => {
        setOpenTwo(true);
    };

    useEffect(() => {

        axios.get(URL_GET_GROUPS)
            .then((result) => {
                const {status, data} = result;
                if (status === 200) {
                    data.sort(models.compareName)
                    dispatch(addGroups(data));
                    let lng = data.length;
                    let obj = data_menu;
                    let c = 0;

                    data.map((item, index) => {

                        if (item.parent_id === "0") {

                            axios.post(URL_GET_PRODUCTS, {group: Number(item.id), count: true}, {})
                                .then((result) => {
                                    const {status, data} = result;
                                    if (status === 200) {
                                        c++
                                        obj.children.push({
                                            id: item.id,
                                            name: item.name,
                                            children: data.sub_groups.sort(models.compareName)
                                        })
                                    }
                                    if (c === lng) {
                                        obj.children.sort(models.compareName)
                                        createObject(obj)
                                    }
                                })

                        }

                    })

                }
            })
            .catch(error => {

                if (typeof error.response !== "undefined") {
                    const {status} = error.response;

                } else {
                    enqueueSnackbar({
                        message: error,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'error',
                            action: (key) => (
                                <Button onClick={() => closeSnackbar(key)}>
                                    <CloseIcon/>
                                </Button>
                            ),
                        },
                    });
                }

            });

    }, []);

    useEffect(() => {

        let sm = 0

        cart.forEach((v, k) => {
            sm = sm + Number(v.amount)
        })

        setSum(sm)

    }, [cart]);

    useEffect(() => {

        if (Object.keys(item).length !== 0) {

            axios.post(URL_GET_PRODUCTS, {group: Number(item.id), count: false})
                .then((result) => {
                    const {status, data} = result;
                    if (status === 200) {
                        setSubgroups(data.sub_groups);
                        setProducts(data.products);
                    }
                })
                .catch(error => {

                    if (typeof error.response !== "undefined") {
                        const {status} = error.response;

                    } else {
                        enqueueSnackbar({
                            message: error,
                            options: {
                                key: new Date().getTime() + Math.random(),
                                variant: "success",
                                action: (key) => (
                                    <Button onClick={() => closeSnackbar(key)}>
                                        <CloseIcon/>
                                    </Button>
                                ),
                            },
                        });
                    }

                });

        }

    }, [item.id]);

    useEffect(() => {
        setChecked(show_cart_sm);
    }, [show_cart_sm]);

    useEffect(() => {
        setOpenModal(show_cart);
        if (show_cart) {
            if (completed === 0) {
                if (cart.length === 0) {
                    let openRequest = indexedDB.open('tea', 1);
                    openRequest.onsuccess = () => {
                        let db = openRequest.result;
                        // При успешном открытии вызвали коллбэк передав ему объект БД
                        let transaction = db.transaction("products", "readonly");
                        let tea = transaction.objectStore("products");
                        let products = tea.getAll();
                        products.onsuccess = function () {
                            if (products.result.length !== 0) {
                                addCart(products.result)
                            }
                        };
                    };
                }
            }
        }
    }, [show_cart]);

    useEffect(() => {
        open_modal &&
        setTimeout(() => {
            setProgress(33.3)
        }, 500)
    }, [open_modal]);

    return (
        <Fragment>
            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                {
                    Object.keys(object).length > 0 &&
                    <>
                        <Suspense fallback={<div>Загрузка...</div>}>
                            <Menu
                                object={object}
                                data={data_menu}
                                open_menu={open_menu}
                                changeWindowState={changeWindowState}
                                changeSubWindowState={changeSubWindowState}
                            />
                            {
                                Object.keys(data_submenu).length > 0 &&
                                <Submenu
                                    data={data_submenu}
                                    open_submenu={open_submenu}
                                    changeSubWindowState={changeSubWindowState}
                                    handlerShowProduct={handlerShowProduct}
                                />
                            }
                        </Suspense>

                    </>
                }
            </Hidden>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open_modal}
                onClose={onHideModal}
                closeAfterTransition
                disableBackdropClick
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    {body}
                </Fade>
            </Modal>


            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open_two}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.wrapper}>
                    <Suspense fallback={<div>Загрузка...</div>}>
                        <ProductOverview
                            product={product}
                            stateWindow={stateWindow}
                        />
                    </Suspense>
                </div>
            </Modal>

            <CssBaseline/>

            <Hidden only="xs">

                <Popper
                    id={item.id}
                    open={open}
                    anchorEl={anchor}
                    className={classes.popper}
                    transition
                    placement={"left-start"}
                    modifiers={{
                        flip: {
                            enabled: true,
                        },
                        preventOverflow: {
                            enabled: false,
                            boundariesElement: 'scrollParent',
                        },
                    }}
                >
                    {({TransitionProps}) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <div className={classes.paper2}>
                                <Suspense fallback={<div>Загрузка...</div>}>
                                    <List
                                        item={item}
                                        sub_groups={sub_groups}
                                        products={products}
                                        closeList={closeList}
                                        handlerShowProduct={handlerShowProduct}
                                    />
                                </Suspense>
                            </div>
                        </Fade>
                    )}
                </Popper>

            </Hidden>

            <Hidden only="xs">
                <Button onClick={entry} className={classes.link}>Админка</Button>
                <Suspense fallback={<div>Загрузка...</div>}>
                    <Entry entry={entry_modal} changeEntry={changeEntry} />
                </Suspense>
            </Hidden>

            <section className={classes.block}>
                <Header/>
            </section>

            <section className={classes.block2}>
                <Line/>
            </section>

            <section className={classes.block3} onClick={closeWindow}>

                <Container maxWidth="lg" className={classes.root}>

                    <div className={classes.container}>

                        <Collapse in={checked} addEndListener={endListener}>
                            <Cart className={classes.cart} elevation={4}/>
                        </Collapse>

                    </div>

                    <Grid container spacing={3}>

                        <Hidden only="xs">
                            <Grid item xs={1} sm={4} lg={4}>
                                <Paper className={classes.menu} ref={target}>
                                    {
                                        groups &&
                                        groups.map((item) =>
                                            (item.parent_id === "0") &&
                                            <Button
                                                key={item.id}
                                                data-id={item.id}
                                                data-list={false}
                                                className={classes.item}
                                                onClick={handlerGetProducts(item)}
                                            >
                                                <div className={classes.name}>
                                                    <span className={item.photo}/>
                                                    <span className={classes.span}>{item.name}</span>
                                                </div>
                                                <ChevronRightIcon className={classes.chevron} size={14}/>
                                            </Button>
                                        )
                                    }
                                </Paper>

                                <Paper className={clsx(classes.news, classes.news2)}>
                                    <h5 className={classes.titleNews}>Новости</h5>
                                    <div className={classes.newsBody}/>
                                </Paper>

                                <Paper className={clsx(classes.news)}>
                                    <h5 className={classes.titleNews}>Статьи</h5>
                                    <div className={classes.newsBody}/>
                                </Paper>

                                <Paper className={clsx(classes.news, classes.email)}>
                                    <div className={classes.emailBody}>
                                        <div className={classes.emailBody2}>
                                            <h5 className={classes.titleEmail}>Подписаться на новости</h5>
                                            <div className={classes.buttonInputBlock}>
                                                <input className={classes.inputEmail} autoComplete="off" type="text"
                                                       name="email"/>
                                                <Button className={classes.buttonEmail}>Подписаться</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Paper>

                            </Grid>
                        </Hidden>

                        <Grid item xs={12} sm={8} lg={8}>

                            <Paper className={classes.carousel}>
                                <Carousel data={steps} />
                            </Paper>

                            <Paper id="carouselCoffee" className={classes.recipe}>
                                <TableTea />
                            </Paper>

                        </Grid>

                    </Grid>

                </Container>

            </section>

        </Fragment>
    );
}

export default Main
