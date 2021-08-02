import React, { useEffect, useState, useRef } from 'react'
import SaveIcon from '@material-ui/icons/Save';
import TimelineIcon from '@material-ui/icons/Timeline';
import EditIcon from '@material-ui/icons/Edit';

import { makeStyles } from "@material-ui/core/styles"
import axios from "axios";
import {URL_CHANGE_PRICE} from "../../../js/Urls";

import {
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction,
} from "../../../actions/actionCreator";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useLocation } from "react-router";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import {Fade, Zoom} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    block: {
        display: 'flex',
        flexDirection: 'row'
    },
    price: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        paddingLeft: 2
    },
    input: {
        width: 35,
        border: 0,
        outline: 'none',
        color: 'rgb(115, 135, 156)',
        fontSize: 13,
        fontFamily: 'inherit',
        fontWeight: 'inherit'
    },
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
    },
}));

function Price(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [open, setOpen] = useState(false)
    const [open_win, setOpenWin] = React.useState(false);
    const [price, setPrice] = useState(props.data.price)
    const [old_price, setOldPrice] = useState(props.data.price)

    const enqueueSnackbar = (...args) => {
        dispatch(enqueueSnackbarAction(...args))
    };

    const closeSnackbar = (...args) => {
        dispatch(closeSnackbarAction(...args));
    };

    const savePrice = (data) => {

        console.log(price, old_price)

        if(price !== old_price) {

            let obj = {
                id: data.id,
                price: price,
                date: Date.now()
            }

            axios.post(URL_CHANGE_PRICE, obj)
                .then((result) => {
                    const {status, data} = result;
                    if (status === 200) {
                        if (data.result) {
                            setOpen(!open)
                            enqueueSnackbar({
                                message: 'Изменения сохранены!',
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
                                message: 'Ошибка!',
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
    }

    const closeEditForm = () => {
        setPrice(old_price);
        setOpen(false);
    }

    const changeVal = (e) => {
        setPrice(e.target.value);
    }

    const chartChangePrice = () => {
        setOpenWin(true);
    }

    const handleClose = () => {
        setOpenWin(false);
    };

    const change = (prc) => {
        setPrice(prc)
        setOpen(true);
    };

    useEffect(() => {
        // console.log(props.data)
    }, [props.data])

    return (
        <>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open_win}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open_win}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Изменения цены</h2>
                        <p id="transition-modal-description">Тут будет график изменения цен.</p>
                    </div>
                </Fade>
            </Modal>

            {
                open &&
                    <div className={classes.block}>
                        <input
                            className={classes.input}
                            onChange={changeVal}
                            onFocus={e => e.target.select()}
                            maxLength={4}
                            type="text"
                            value={price}
                            autoFocus
                        />
                        <Zoom in={open}>
                            <div style={{
                                transitionDelay: open ? '500ms' : '0ms',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <IconButton
                                    size="small"
                                    title="Сохранить цену"
                                    style={{color: "rgb(97, 59, 231)"}}
                                    onClick={() => savePrice(props.data)}
                                >
                                    <SaveIcon/>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    title="Не сохранять изменения"
                                    style={{color: "rgb(97, 59, 231)"}}
                                    onClick={closeEditForm}
                                >
                                    <CloseIcon/>
                                </IconButton>
                            </div>
                        </Zoom>
                    </div>
            }

            {
                !open &&
                    <div className={classes.block}>
                        <span className={classes.price}>{price}</span>
                        <Zoom in={!open}>
                            <div style={{
                                transitionDelay: open ? '500ms' : '0ms',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <IconButton
                                    size="small"
                                    title=""
                                    style={{color: "rgb(97, 59, 231)"}}
                                    onClick={() => change(price)}
                                >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    title="Изменение цены"
                                    style={{color: "rgb(97, 59, 231)"}}
                                    onClick={chartChangePrice}
                                >
                                    <TimelineIcon/>
                                </IconButton>
                            </div>
                        </Zoom>
                    </div>
            }
        </>
    );
}

export default Price
