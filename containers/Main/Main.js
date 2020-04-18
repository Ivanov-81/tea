import React, {Fragment, useEffect, useState, createRef} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Link} from "react-router-dom"
import axios from "axios"
import clsx from "clsx"

import {makeStyles, createMuiTheme} from "@material-ui/core/styles"
import {createStyles} from "@material-ui/core"
import Hidden from '@material-ui/core/Hidden'
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import CssBaseline from "@material-ui/core/CssBaseline"
import Button from "@material-ui/core/Button"
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CloseIcon from '@material-ui/icons/Close'

import Header from "../../components/Header"
import Line from "../../components/Line"
import Carousel from "../../components/Carousel"
import List from "../../containers/Main/List/List"
import Cart from "../../containers/Cart/Cart"

import {
    addGroups,
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction, switchShowCart,
} from "../../actions/actionCreator"

import Container from "@material-ui/core/Container";
import Popper from "@material-ui/core/Popper";
import Collapse from '@material-ui/core/Collapse';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ThemeProvider} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import {CheckBox, CheckBoxOutlineBlank} from "@material-ui/icons";

import {SITE_KEY} from "../../js/constants"
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        color: "#000000",
        padding: "55px 23px 0 23px",
        flexGrow: 1,
    },
    menu: {
        height: "222px",
        backgroundColor: "#EFE6DF",
        border: "1px solid #D5BC9C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        minWidth: "186px",
    },
    carousel: {
        height: "422px",
        backgroundColor: "#EFE6DF",
        border: "1px solid #D5BC9C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0px",
    },
    block: {
        position: "relative",
        display: "flex",
        width: "100%",
        height: "52px",
        color: "#BA975F",
        flexDirection: "column",
        backgroundColor: "#041715",
        padding: "0 0 0 23px"
    },
    block2: {
        position: "relative",
        display: "flex",
        width: "100%",
        height: "50px",
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
        bottom: "18px",
        right: "25px",
        color: "#BA975F",
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
        backgroundColor: "#EFE6DF",
        fontSize: "15px",
        fontWeight: 400,
        color: "#815333",
        "&:hover": {
            color: "#815333",
            backgroundColor: "#EFE6DF",
        }
    },
    chevron: {
        display: "flex",
        padding: "2px",
        color: "#D5BC9C",
    },
    name: {
        display: "flex",
    },
    span: {
        overflow: "hidden",
        height: "28px",
        textAlign: "left",
    },
    popper: {},
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
        width: "600px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    paper2: {
        width: "850px",
        height: "600px",
        backgroundColor: "#EFE6DF",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
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
    },
    closeModal: {
        position: "absolute",
        right: 0,
        color: "#ff0000",
    },
    header: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "35px",
        fontSize: "18px",
        color: "#041715",
    },
    body: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        height: "400px",
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
        marginTop: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
    },
    bF: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
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
        // [theme.breakpoints.down('lg')]: {
        //     fontSize: "14px",
        //     fontWeight: 400,
        //     lineHeight: "14px",
        //     margin: "5px 0 0 0",
        // },
        // [theme.breakpoints.down('md')]: {
        //     fontSize: "13px",
        //     lineHeight: "13px",
        //     fontWeight: 400,
        //     margin: "4px 0 0 0",
        //     overflow: "hidden",
        //     whiteSpace: "nowrap",
        // },
        // [theme.breakpoints.down('sm')]: {
        //     fontSize: "12px",
        //     lineHeight: "12px",
        //     fontWeight: 300,
        //     margin: "3px 0 0 0",
        //     overflow: "hidden",
        //     whiteSpace: "nowrap",
        // },
    },
    input: {
        margin: "5px 0 0 0",
        color: "#879196",
        width: "200px",
        "& div": {
            height: "35px",
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
    },
    inputArea: {
        color: "#879196",
        width: "90%",
        margin: "5px 0 0 0",
        "& div": {
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
    }
}));

export default function Main() {

    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = createMuiTheme({});

    let target = createRef();

    const [anchor, setAnchor] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [item, setItem] = React.useState({});
    const [sub_groups, setSubgroups] = React.useState([]);
    const [products, setProducts] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    const [open_modal, setOpenModal] = React.useState(false);
    const [open_cart, setOpenCart] = React.useState(false);
    const [completed, setCompleted] = React.useState(0);
    const [progress, setProgress] = React.useState(0);
    const [completed_dis, setCompletedDis] = React.useState(true);
    const [next, setNext] = React.useState("Далее");
    const [completed_next, setCompletedNext] = React.useState(false);

    const [checked, setChecked] = React.useState(false);
    const [status_checked, setStatusChecked] = React.useState(false);

    const [phone, setPhone] = React.useState("");
    const [errorPhone, setErrorPhone] = useState(false);
    const [helperTextPhone, setHelperTextPhone] = useState("");

    const [name, setName] = React.useState("");
    const [errorName, setErrorName] = useState(false);
    const [helperTextName, setHelperTextName] = useState("");

    const [email, setEmail] = React.useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [helperTextEmail, setHelperTextEmail] = useState("");

    const groups = useSelector(store => store.catalogs.groups);
    const show_cart = useSelector(store => store.app.show_cart);
    const show_cart_sm = useSelector(store => store.app.show_cart_sm);

    const [captcha, setCaptcha] = useState(null);
    const [checked_loader, setCheckedLoader] = useState(false);

    const [description, setDescription] = useState("");

    const [address, setAddress] = useState("");
    const [errorAddress, setErrorAddress] = useState(false);
    const [helperAddress, setHelperAddress] = useState("");

    const [default_address, setDefaultAddress] = useState("г.Берёзовский ТЦ Центральный. Театральная улица, 6");
    const [delivery, setDelivery] = useState({
        bool: false,
        address: "г.Берёзовский ТЦ Центральный. Театральная улица, 6"
    });
    const [city, setCity] = useState("Берёзовский");
    const [cities] = useState([
        {id: "Берёзовский", name: "Берёзовский"},
        {id: "Екатеринбург", name: "Екатеринбург"},
        {id: "Верхняя Пышма", name: "Верхняя Пышма"},
        {id: "Среднеуральск", name: "Среднеуральск"}
    ]);

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

    const handlerGetProducts = (item) => {

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

    const handlerCheckDelivery = () => {
        if (delivery.bool) {
            setDelivery({bool: false, address: ""});
            setAddress("");
        } else {
            setAddress("");
            setDelivery({bool: true, address: ""});
            setAddress(default_address);
            setCity("Берёзовский");
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

    const clearFields = () => {
        setName("");
        setPhone("");
        setEmail("");

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
            axios.post('/captcha.php', {key: SITE_KEY})
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
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

            if (reg.test(email) === false) {
                setErrorEmail(true);
                setHelperTextEmail("Введите корректный E-mail");
                return false;
            }
        }

        let object = {
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

                object['products'] = products.result

                axios.post('/send_mail.php', object)
                    .then((result) => {
                        const {status, data} = result;
                        if (status === 200) {
                            if (data === "ok") {
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
                            } else {
                                enqueueSnackbar({
                                    message: data.data,
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

            };
        };
    };

    const addStep = () => {

        if (completed < 2) {
            let number = completed + 1

            if(number === 1) {
                setCompleted(number)
            }

            if(number === 2) {
                if (address === "") {
                    setErrorAddress(true)
                    setHelperAddress("Введите адрес")
                    return
                }
                else {
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
                <div className={classes.bodyForm}>
                    {
                        (completed === 0) &&
                        "Корзина"
                    }
                    {
                        (completed === 1) &&
                        <section className={classes.bF}>
                            <div className={classes.delivery}>
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
                            </div>
                            <div className={classes.pickup}>

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

                            </div>
                        </section>
                    }
                    {
                        (completed === 2) &&
                        <Fragment>

                            <div className={classes.phone}>Представтесь пожалуйста</div>
                            <ThemeProvider theme={theme}>
                                <TextField
                                    error={errorName}
                                    helperText={helperTextName}
                                    placeholder="Виктория Олеговна"
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
                </Button>
            </div>
        </div>
    );

    const endListener = (element, func) => {
        // console.log(element);
        // console.log(func);
    };

    useEffect(() => {

        axios.get('/groups.php', {
            // headers: {
            //     Authorization: 'Bearer ' + models.getCookie('Authorization')
            // }
        })
            .then((result) => {
                const {status, data} = result;
                if (status === 200) {

                    console.log(data);

                    dispatch(addGroups(data));

                }
            })
            .catch(error => {

                if (typeof error.response !== "undefined") {
                    const {status} = error.response;

                } else {
                    console.log(error);
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

        if (Object.keys(item).length !== 0) {

            axios.post('/products.php', {group: Number(item.id)}, {
                // headers: {
                //     Authorization: 'Bearer ' + models.getCookie('Authorization')
                // }
            })
                .then((result) => {
                    const {status, data} = result;
                    if (status === 200) {

                        console.log(data);

                        setSubgroups(data.sub_groups);
                        setProducts(data.products);

                    }
                })
                .catch(error => {

                    if (typeof error.response !== "undefined") {
                        const {status} = error.response;

                    } else {
                        console.log(error);
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
    }, [show_cart]);

    useEffect(() => {
        open_modal &&
        setTimeout(() => {
            setProgress(33.3)
        }, 500)
    }, [open_modal]);

//     var iconv = new Iconv('windows-1251', 'UTF-8');
// var x = iconv.convert(text);
// console.log(x.toString());

    return (
        <Fragment>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open_modal}
                onClose={() => dispatch(switchShowCart(false))}
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
                                <List
                                    item={item}
                                    sub_groups={sub_groups}
                                    products={products}
                                    closeList={closeList}
                                />
                            </div>
                        </Fade>
                    )}
                </Popper>
            </Hidden>

            <Link to="/admin_panel" className={classes.link}>Админка</Link>

            <section className={classes.block}>
                <Header/>
            </section>

            <section className={classes.block2}>
                <Line/>
            </section>

            <section className={classes.block3}>

                <Container maxWidth="lg" className={classes.root}>

                    <div className={classes.container}>

                        <Collapse in={checked} addEndListener={endListener}>
                            {/*<Fade {...TransitionProps} timeout={350}>*/}
                            <Cart className={classes.cart} elevation={4}/>
                            {/*</Fade>*/}
                        </Collapse>

                    </div>

                    <Grid container spacing={3}>

                        <Hidden only="xs">
                            <Grid item xs={0} sm={4} lg={4}>
                                <Paper className={classes.menu} ref={target}>
                                    {
                                        groups &&
                                        groups.map((item) =>
                                            (item.parent_id === "0") &&
                                            <Button
                                                key={item.id}
                                                data-id={item.id}
                                                className={classes.item}
                                                onClick={() => handlerGetProducts(item)}
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
                            </Grid>
                        </Hidden>

                        <Grid item xs={12} sm={8} lg={8}>
                            <Paper className={classes.carousel}>
                                <Carousel/>
                            </Paper>
                        </Grid>

                    </Grid>

                </Container>

            </section>

        </Fragment>
    );
}