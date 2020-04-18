import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"

import {makeStyles, createMuiTheme} from "@material-ui/core/styles"
import {createStyles} from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close'
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button";
import {Add, Remove} from "@material-ui/icons";
import clsx from "clsx";
import {
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction,
    refreshCart
} from "../../actions/actionCreator";

const useStyles = makeStyles(() => createStyles({
    paper: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        top: "10px",
        bottom: "10px",
        right: "10px",
        left: "10px",
        border: "3px solid #BA975F",
        borderRadius: "4px",
    },
    header: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        width: "100%",
        height: "40px",
        color: "#BA975F",
        textAlign: "center",
        fontSize: "18px",
        lineHeight: "18px",
        fontWeight: 500
    },
    closeButton: {
        display: "flex",
        position: "absolute",
        right: 0,
        top: "4px",
        margin: "0 5px 0 0",
        color: "#FF0000",
    },
    body: {
        display: "flex",
        width: "100%",
        height: "calc(100% - 40px)",
        flexDirection: "column",
    },
    block1: {
        display: "flex",
        width: "100%",
        height: "55%",
        flexDirection: "row",
    },
    blockPhoto: {
        width: "calc(50% - 40px)",
        height: "calc(100% - 40px)",
        display: "flex",
        margin: "20px",
        border: "3px solid #BA975F",
        borderRadius: "4px",
        overflow: "hidden",
    },
    photo: {
        width: "100%",
        height: "100%",
    },
    description: {
        display: "flex",
        width: "50%",
        height: "100%",
        flexDirection: "column",
        color: "#BA975F",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "30px 10px",
    },
    desc: {
        width: "100%",
        padding: "0 15px 0 0",
        justifyContent: "space-between",
    },
    title: {
        color: "#BA975F",
        fontSize: "16px",
        lineHeight: "16px",
    },
    text: {
        padding: "10px 15px 0 0",
        textAlign: "center",
        fontSize: "14px",
        lineHeight: "17px",
        overflow: "hidden",
        width: "100%"
    },
    block2: {
        display: "flex",
        width: "100%",
        height: "45%",
        flexDirection: "row",
    },
    blk: {
        display: "flex",
        width: "50%",
        height: "100%",
        flexDirection: "column",
        color: "#BA975F",
        justifyContent: "flex-start",
        alignItems: "center",
        fontSize: "20px",
        lineHeight: "35px",
    },
    quantity: {
        color: "#BA975F",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        margin: "20px 0"
    },
    vendorCode: {},
    unit: {
        width: "100px",
        height: "42px",
        border: "1px solid #BA975F",
        color: "#BA975F",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 15px"
    },
    price: {},
    amount: {},
    but: {
        color: "#BA975F",
        textTransform: "none",
        position: "absolute",
        bottom: "40px",
    }
}));

export default function ProductOverview(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    // const history = useHistory();
    const theme = createMuiTheme({});

    const [product, setProduct] = useState(props.product);
    const [quantity, setQuantity] = useState(1);

    const enqueueSnackbar = (...args) => {
        dispatch(enqueueSnackbarAction(...args))
    };

    const closeSnackbar = (...args) => {
        dispatch(closeSnackbarAction(...args));
    };

    const set = (db, data, storeName, accessRights, key) => {

        let request = db.transaction(storeName, accessRights).objectStore(storeName).put(data, key);

        request.onerror = () => {
            enqueueSnackbar({
                message: JSON.stringify(request),
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
        };

        request.onsuccess = () => {
            enqueueSnackbar({
                message: "Товар добавлен в корзину",
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
            handlerCloseModal();
            dispatch(refreshCart(true));
            setTimeout(() => {
                dispatch(refreshCart(false));
            },500);

        }

    };

    const handlerAddToBasket = () => {

        let openRequest = indexedDB.open('tea', 1);

        openRequest.onsuccess = () => {

            let db = openRequest.result;

            product["amount"] = quantity * props.product.price;

            let transaction = db.transaction("products", "readonly");
            let tea = transaction.objectStore("products");
            let prods = tea.get(product.id);
            prods.onsuccess = function () {

                if (prods.result !== undefined) {
                    let odj = prods.result;
                    product["amount"] = odj.amount + (quantity * props.product.price);
                    set(db, product, "products", "readwrite", product.id);
                } else {
                    set(db, product, "products", "readwrite", product.id);
                }

            };

            //

        };
    };

    const handlerAdd = () => {
        if (quantity > 0) {
            setQuantity(quantity + 1)
        }
    };

    const handlerRemove = () => {
        if ((quantity * props.product.price) > props.product.price) {
            setQuantity(quantity - 1)
        }
    };

    const handlerCloseModal = () => {
        props.stateWindow(false);
    };

    useEffect(() => {

    }, []);

    return (
        <Fragment>
            <div className={classes.paper}>

                <div className={classes.header}>
                    {product.name}
                    <IconButton
                        onClick={handlerCloseModal}
                        className={classes.closeButton}
                    >
                        <CloseIcon/>
                    </IconButton>
                </div>

                <div className={classes.body}>

                    <div className={classes.block1}>

                        <div className={classes.blockPhoto}>
                            <img
                                alt="img"
                                src={product.photo}
                                className={classes.photo}
                            />
                        </div>

                        <div className={classes.description}>
                            <span className={classes.title}>Описание:</span>
                            <span className={classes.text}>
                                {product.description}
                            </span>
                        </div>

                    </div>

                    <div className={classes.block2}>

                        <div className={classes.blk}>
                            <span className={classes.vendorCode}>Артикул: {product.vendor_code}</span>
                            <span className={classes.vendorCode}>Ед. изм.: {product.unit}</span>
                            <span className={classes.vendorCode}>Цена: {product.price} руб.</span>


                            <div className={classes.quantity}>

                                <Button onClick={handlerRemove} style={{color: "#BA975F"}}>
                                    <Remove/>
                                </Button>

                                <div className={classes.unit}>
                                    {quantity * Number(product.price)}
                                </div>

                                <Button onClick={handlerAdd} style={{color: "#BA975F"}}>
                                    <Add/>
                                </Button>

                            </div>


                            <span>ИТОГО: {quantity * Number(product.price)} руб.</span>

                        </div>

                        <div className={classes.blk}>

                            <span className={classes.title}>Рецепт приготовления:</span>

                            <div className={classes.text}>
                                {product.recipe}
                            </div>

                            <Button className={classes.but} onClick={handlerAddToBasket}>
                                Добавить в корзину
                            </Button>

                        </div>
                    </div>

                </div>

            </div>
        </Fragment>
    );
}