import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {useHistory} from "react-router-dom"
import axios from "axios"
import clsx from "clsx"
import PropTypes from 'prop-types'

import {makeStyles, createMuiTheme} from "@material-ui/core/styles"
import {createStyles} from "@material-ui/core"
import Container from "@material-ui/core/Container"
import withWidth from '@material-ui/core/withWidth'
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import DehazeIcon from '@material-ui/icons/Dehaze';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "50px",
        color: "#000000",
        backgroundColor: "#BA975F",
    },
    address: {
        position: "absolute",
        display: "flex",
        fontSize: "19px",
        fontWeight: "normal",
        color: "#000000",
        left: 0,
    },
    image: {
        zIndex: 1
    },
    hamburger: {
        position: "absolute",
        right: "0px",
        margin: "0 15px 0 0",
        color: "#041715",
    },
    width: {
        position: "absolute",
        right: "0px",
        top: "0px",
        margin: "0 4px 0 0",
        color: "#041715",
        fontSize: "12px"
    }
}));

function Line(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const theme = createMuiTheme({});

    const {width} = props;

    return (
        <Container maxWidth="lg" className={classes.root}>

            <Hidden only="xs">
                <div className={classes.address}>ЧАЙ, КОФЕ, ПОДАРОЧНЫЕ НАБОРЫ</div>
            </Hidden>

            <img alt="logo" src="../images/sign.png" className={classes.image}/>
            <span className={classes.width}>{width}</span>
            <Hidden only={['sm', 'lg', 'md', 'xl']}>

                <span className="address">г. Берёзовский<br />Театральная 6</span>

                <IconButton className={classes.hamburger}>
                    <DehazeIcon/>
                </IconButton>
            </Hidden>

        </Container>
    );
}

Line.propTypes = {
    width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
};

export default withWidth()(Line);