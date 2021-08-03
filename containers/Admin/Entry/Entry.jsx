import React, {useEffect, useState} from 'react'
import clsx from 'clsx'
import Modal from '@material-ui/core/Modal'
import Slide from '@material-ui/core/Slide'
import Backdrop from '@material-ui/core/Backdrop'

import {makeStyles} from "@material-ui/core/styles"
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, OutlinedInput, TextField} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {URL_ENTRY_ADMIN} from "../../../js/Urls";
import {SITE_KEY} from "../../../js/constants";
import CloseIcon from "@material-ui/icons/Close";
import {
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction,
} from "../../../actions/actionCreator";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";
import { useLocation } from "react-router";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        display: "flex",
        flexDirection: "column"
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        marginTop: theme.spacing(2),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        // width: '25ch',
    },
    button: {
        height: 44,
        textTransform: 'none',
        fontSize: 18
    }
}));

function Entry(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [open, setOpen] = React.useState(props.entry);
    const [values, setValues] = React.useState({
        login: null,
        password: null,
        showPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword});
    };

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClose = () => {
        setOpen(false);
        props.changeEntry(false)
    };

    const enqueueSnackbar = (...args) => {
        dispatch(enqueueSnackbarAction(...args))
    };

    const closeSnackbar = (...args) => {
        dispatch(closeSnackbarAction(...args));
    };

    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const enrty = () => {

        axios.post(URL_ENTRY_ADMIN, {_csrf: SITE_KEY, login: values.login, password: values.password})
            .then((result) => {
                const {status, data} = result;
                if (status === 200) {
                    if (data.result) {
                        history.push('/admin_panel')
                        let now = new Date();
                        now.setTime(now.getTime() + 3600 * 1000);
                        document.cookie = "name=admin; expires=" + now.toUTCString() + "; path=/";
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

    };

    useEffect(() => {

        if (props.entry && getCookie('name') === 'admin') {
            history.push('/admin_panel')
        } else {
            if(props.entry && window.location.host === 'tea') {
                history.push('/admin_panel')
            }
            else {
                setOpen(props.entry)
            }
        }

    }, [props.entry])

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title">Вход в админку</h2>

                    <TextField
                        id="outlined-textarea"
                        label="Логин"
                        multiline
                        variant="outlined"
                        value={values.login}
                        onChange={handleChange('login')}
                    />

                    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {values.showPassword ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                    </FormControl>

                    <Button className={clsx(classes.margin, classes.button)} onClick={enrty}
                            variant="outlined">Войти</Button>

                </div>
            </Slide>
        </Modal>
    );
}

export default Entry
