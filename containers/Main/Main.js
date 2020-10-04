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
import Avatar from '@material-ui/core/Avatar'

import Header from "../../components/Header"
import Line from "../../components/Line"
import Carousel from "../../components/Carousel"
import List from "../../containers/Main/List/List"
import Cart from "../../containers/Cart/Cart"

import {
    addGroups,
    switchShowCart,
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction, addCart, refreshCart, switchMenu,
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
import Divider from "@material-ui/core/Divider";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import Menu from "./Menu/Menu";

const useStyles = makeStyles((theme) => createStyles({
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
        backgroundColor: "#092924",
        // border: "1px solid #D5BC9C",
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
        borderRight: "1px solid #D5BC9C",
        backgroundColor: "#EFE6DF",
        fontSize: "15px",
        fontWeight: 400,
        color: "#815333",
        borderRadius: 0,
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
    popper: {
        left: "-10px !important"
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
        width: "600px",
        height: "550px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    paper2: {
        width: "885px",
        height: "600px",
        backgroundColor: "#EFE6DF",
        borderRadius: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        [theme.breakpoints.down('lg')]: {
            width: "850px",
        },
        [theme.breakpoints.down('md')]: {
            width: "645px",
        },
        [theme.breakpoints.down('sm')]: {
            width: "430px",
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
        [theme.breakpoints.down('lg')]: {

        },
        [theme.breakpoints.down('md')]: {

        },
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
    },
    news: {
        position: "relative",
        display: "flex",
        margin: "10px 0 0 0",
        borderRadius: 0,
        height: "222px",
        minWidth: "186px",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: "#092924",
    },
    news2: {
        margin: "15px 0 0 0",
    },
    titleNews: {
        textAlign: "center",
        position: "relative",
        top: "20px",
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
        height: "120px",
        backgroundColor: "inherit",
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
        height: "327px",
        backgroundColor: "#092924",
        borderRadius: 0,
        [theme.breakpoints.down('lg')]: {
            height: "327px",
        },
        [theme.breakpoints.down('md')]: {
            height: "327px",
        },
        [theme.breakpoints.down('sm')]: {
            height: "245px",
        },
    },
    recipeInner: {
        position: "absolute",
        width: "auto",
        height: "auto",
        border: "1px solid #A58A58",
        top: "10px",
        left: "10px",
        bottom: "10px",
        right: "10px"
    },
    innerText: {
        width: "100%",
        height: "30px",
        color: "#BA975F",
        textAlign: "center",
        position: "relative",
        fontSize: "20px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down('lg')]: {
            height: "30px",
        },
        [theme.breakpoints.down('md')]: {
            height: "30px",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "13px",
        },
    },
    innerLine: {
        position: "absolute",
        top: "40px",
        width: "calc(100% + 23px)",
        height: "30px",
        margin: "0 -11px 0 -11px",
        background: "#D9C4A5",
        color: "#092924",
        [theme.breakpoints.down('lg')]: {
            height: "30px",
        },
        [theme.breakpoints.down('md')]: {
            height: "30px",
        },
        [theme.breakpoints.down('sm')]: {
            height: "30px",
            top: "30px",
        },
    },
    divTea: {
        color: "#092924",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontSize: "15px",
        position: "relative",
        display: "inline-block",
        width: "20%",
        height: "100%",
        textAlign: "center",
        padding: "5px 0 0 0",
        [theme.breakpoints.down('lg')]: {
            fontSize: "15px",
            width: "20%",
        },
        [theme.breakpoints.down('md')]: {
            fontSize: "13px",
            width: "20%",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "11px",
            padding: "8px 0 0 0",
            width: "20%",
        },
    },
    black: {},
    green: {},
    red: {},
    lineTea: {
        position: "relative",
        width: "90%",
        height: 0,
        borderTop: "1px solid #BA975F",
        top: "20px",
        margin: "0 30px 0 40px",
        [theme.breakpoints.down('lg')]: {
            margin: "0 30px 0 40px",
        },
        [theme.breakpoints.down('md')]: {
            margin: "0 30px 0 40px",
        },
        [theme.breakpoints.down('sm')]: {
            margin: "0 30px 0 15px",
        },
    },
    lineTeaText: {
        position: "absolute",
        color: "#BA975F",
        width: "180px",
        textAlign: "center",
        margin: "-10px 0 0 -90px",
        background: "#092924",
        left: "50%",
        fontSize: "13px",
        [theme.breakpoints.down('lg')]: {
            fontSize: "13px",
        },
        [theme.breakpoints.down('md')]: {
            fontSize: "13px",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "12px",
            margin: "-9px 0 0 -83px",
            width: "165px"
        },
    },
    blockTea: {
        position: "relative",
        width: "calc(100% - 22px)",
        height: "35px",
        color: "#D9C4A5",
        margin: "35px 11px 0 11px",
        [theme.breakpoints.down('lg')]: {
            margin: "35px 11px 0 11px",
        },
        [theme.breakpoints.down('md')]: {
            margin: "35px 11px 0 11px",
        },
        [theme.breakpoints.down('sm')]: {
            margin: "25px 11px 0 11px",
            height: "22px",
        },
    },
    blockTeaOne: {},
    blockTeaTwo: {},
    blockTeaTree: {},
    blockTeaSpan: {
        position: "relative",
        display: "inline-block",
        width: "20%",
        height: "100%",
        textAlign: "center",
        padding: "9px 0 0 0",
        fontSize: "13px",
        [theme.breakpoints.down('lg')]: {
            fontSize: "13px",
        },
        [theme.breakpoints.down('md')]: {
            fontSize: "13px",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "12px",
        },
    },
    lineTeaTextTwo: {
        position: "absolute",
        color: "#BA975F",
        width: "140px",
        textAlign: "center",
        margin: "-10px 0 0 -70px",
        background: "#092924",
        left: "50%",
        fontSize: "13px",
        [theme.breakpoints.down('lg')]: {
            fontSize: "13px",
        },
        [theme.breakpoints.down('md')]: {
            fontSize: "13px",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "12px",
            margin: "-9px 0 0 -65px",
            width: "130px"
        },
    },
    lineTeaTextTree: {
        position: "absolute",
        color: "#BA975F",
        width: "150px",
        textAlign: "center",
        margin: "-10px 0 0 -75px",
        background: "#092924",
        left: "50%",
        fontSize: "13px",
        [theme.breakpoints.down('lg')]: {
            fontSize: "13px",
        },
        [theme.breakpoints.down('md')]: {
            fontSize: "13px",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "12px",
            margin: "-9px 0 0 -65px",
            width: "135px"
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
        alignItems: "center"
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
        textAlign: "center",
        color: "#555",
        overflow: "hidden",
        whiteSpace: "pre-wrap",
        textOverflow: "ellipsis",
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
    }
}));

export default function Main() {

    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = createMuiTheme({});

    let target = createRef();

    const cart = useSelector(store => store.catalogs.cart);
    const groups = useSelector(store => store.catalogs.groups);
    const show_cart = useSelector(store => store.app.show_cart);
    const show_cart_sm = useSelector(store => store.app.show_cart_sm);
    const open_menu = useSelector(store => store.app.open_menu);

    const [anchor, setAnchor] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sum, setSum] = useState(0);

    const [item, setItem] = useState({});
    const [sub_groups, setSubgroups] = useState([]);
    const [products, setProducts] = useState([]);

    const [open, setOpen] = useState(false);
    const [open_modal, setOpenModal] = useState(false);
    const [open_cart, setOpenCart] = useState(false);
    const [completed, setCompleted] = useState(0);
    const [progress, setProgress] = useState(0);
    const [completed_dis, setCompletedDis] = useState(true);
    const [next, setNext] = useState("Далее");
    const [completed_next, setCompletedNext] = useState(false);

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

    const saveOrder = (object) => {

        object["data"] = JSON.stringify(object.products)
        object["date"] = new Date()

        axios.post('/orders.php', object)

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
                                closeModal()
                                clearFields()
                                saveOrder(object)
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
                                            <span title={item.name.split('"').join('`')}
                                                  className={classes.descSpan}>{item.name}</span>
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

    const changeWindowState = () => {
        dispatch(switchMenu(!open_menu))
    }

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

        let sm = 0

        cart.forEach((v, k) => {
            sm = sm + Number(v.amount)
        })

        setSum(sm)

    }, [cart]);

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

            <Menu
                open_menu={open_menu}
                changeWindowState={changeWindowState}
            />

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

            <Hidden only="xs">

                <Link to="/admin_panel" className={classes.link}>Админка</Link>

            </Hidden>

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

                                <Paper className={clsx(classes.news, classes.news2)}>
                                    <h5 className={classes.titleNews}>Новости</h5>
                                    <div className={classes.newsBody}></div>
                                </Paper>

                                <Paper className={clsx(classes.news)}>
                                    <h5 className={classes.titleNews}>Статьи</h5>
                                    <div className={classes.newsBody}></div>
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
                                <Carousel/>
                            </Paper>

                            <Paper id="carouselCoffee" className={classes.recipe}>

                                <div className={classes.recipeInner}>
                                    <span className={classes.innerText}>КАК ПРАВИЛЬНО ЗАВАРИВАТЬ ЧАЙ</span>
                                    <div className={classes.innerLine}>
                                        <div className={clsx(classes.divTea, classes.black)}>ЧЁРНЫЙ</div>
                                        <div className={clsx(classes.divTea, classes.green)}>ЗЕЛЁНЫЙ</div>
                                        <div className={clsx(classes.divTea, classes.red)}>КРАСНЫЙ</div>
                                        <div className={clsx(classes.divTea, classes.yellow)}>ЖЁЛТЫЙ</div>
                                        <div className={clsx(classes.divTea, classes.white)}>БЕЛЫЙ</div>
                                        <div className={classes.lineTea}>
                                            <span className={classes.lineTeaText}>Заварки на 200 мл. воды</span>
                                        </div>
                                        <div className={clsx(classes.blockTea, classes.blockTeaOne)}>
                                            <span className={classes.blockTeaSpan}>1 ч.ложка</span>
                                            <span className={classes.blockTeaSpan}>3 гр.</span>
                                            <span className={classes.blockTeaSpan}>2 гр.</span>
                                            <span className={classes.blockTeaSpan}>4 гр.</span>
                                            <span className={classes.blockTeaSpan}>2 ч.ложки</span>
                                        </div>
                                        <div className={classes.lineTea}>
                                            <span className={classes.lineTeaTextTwo}>Температура воды</span>
                                        </div>
                                        <div className={clsx(classes.blockTea, classes.blockTeaTwo)}>
                                            <span className={classes.blockTeaSpan}>90-100 ℃</span>
                                            <span className={classes.blockTeaSpan}>80 ℃</span>
                                            <span className={classes.blockTeaSpan}>95-97 ℃</span>
                                            <span className={classes.blockTeaSpan}>85 ℃</span>
                                            <span className={classes.blockTeaSpan}>50-70 ℃</span>
                                        </div>
                                        <div className={classes.lineTea}>
                                            <span className={classes.lineTeaTextTree}>Время заваривания</span>
                                        </div>
                                        <div className={clsx(classes.blockTea, classes.blockTeaTree)}>
                                            <span className={classes.blockTeaSpan}>4-7 мин.</span>
                                            <span className={classes.blockTeaSpan}>5 мин.</span>
                                            <span className={classes.blockTeaSpan}>5 мин.</span>
                                            <span className={classes.blockTeaSpan}>8-10 мин.</span>
                                            <span className={classes.blockTeaSpan}>5 мин.</span>
                                        </div>
                                    </div>
                                </div>

                            </Paper>

                        </Grid>

                    </Grid>

                </Container>

            </section>

        </Fragment>
    );
}