import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    recipeInner: {
        position: "absolute",
        width: "auto",
        height: "auto",
        border: "1px solid #A58A58",
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
    },
    innerText: {
        width: "100%",
        height: 39,
        color: "#BA975F",
        textAlign: "center",
        position: "relative",
        fontSize: "20px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down('lg')]: {
            height: 39,
        },
        [theme.breakpoints.down('md')]: {
            height: 39,
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "13px",
        },
    },
    innerLine: {
        position: "absolute",
        top: 40,
        width: "calc(100% + 23px)",
        height: 30,
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
    blockTeaOne: {},
    blockTeaTwo: {},
    blockTeaTree: {},
    black: {},
    green: {},
    red: {},
    yellow: {},
    white: {},
}));

export default function Carousel() {
    const classes = useStyles();
    return (
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
    )
}
