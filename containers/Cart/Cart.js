import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"

import {makeStyles} from "@material-ui/core/styles"
import {createStyles} from "@material-ui/core"
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
    addCart,
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction,
    refreshCart,
    switchShowCart,
    switchShowCartSm
} from "../../actions/actionCreator";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        width: "100%",
        height: "100%",
        border: "3px solid #BA975F",
        display: "flex",
        position: "absolute",
        flexDirection: "column",
        zIndex: 9,
        boxShadow: "0px 1px 3px 1px rgba(0, 0, 0, .35)",
        backgroundColor: "#EFE6DF",
    },
    cartHeader: {
        width: "100%",
        height: "35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        fontSize: "16px",
    },
    clear: {
        right: "8px",
        fontSize: "12px",
        textDecoration: "underline",
        color: "#013E1C",
        cursor: "pointer",
        opacity: 0.3,
    },
    cartBody: {
        width: "100%",
        height: "260px",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "auto",
    },
    footer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "48px",
    },
    button: {
        backgroundColor: "#d8c3a4",
        color: "darkgreen",
        textTransform: "none",
        padding: "0 10px",
        height: "33px",
        border: "1px solid darkgreen",
        fontSize: "13px",
        margin: "0 5px 0 0",
        "&:hover": {
            backgroundColor: "#d8c3a4",
            color: "darkgreen",
            border: "1px solid darkgreen",
        }
    },
    makeAPurchase: {
        backgroundColor: "darkgreen",
        color: "#d8c3a4",
        textTransform: "none",
        padding: "0 10px",
        height: "33px",
        fontSize: "13px",
        margin: "0 0 0 5px",
        "&:hover": {
            backgroundColor: "darkgreen",
            color: "#d8c3a4",
        }
    },
    product: {
        display: "flex",
        flexDirection: "row",
        fontSize: "13px",
        width: "100%",
        minHeight: "75px",
        maxHeight: "75px",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
    },
    imageSm: {
        height: "65px",
        width: "65px",
        margin: "0 0 0 7px",
    },
    info: {
        width: "76%",
        height: "100%",
        padding: "0 20px 0 0",
    },
    deleteButton: {
        position: "absolute",
        right: "2px",
        top: 0,
        height: "19px",
        padding: 0,
        color: "#ff0000",
    },
    loader: {
        position: "absolute",
        color: "darkgreen",
    },
    loaderOrder: {
        position: "absolute",
        color: "#d8c3a4",
    },
    infoName: {
        width: "100%",
        height: "65%",
        lineHeight: "14px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        "-webkitFontSmoothing": "antialiased",
    },
    infoQty: {
        width: "100%",
        height: "35%",
        display: "flex",
        flexDirection: "row",
    },
    infoChange: {
        width: "50%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    infoTotal: {
        width: "50%",
        height: "100%",
    },
    infoInput: {
        width: "60px",
        height: "20px",
        textAlign: "center",
    },
    rounded: {},
    name: {
        width: "80%",
        paddingLeft: "5px",
    },
    price: {
        width: "20%",
        paddingLeft: "5px",
        fontSize: "12px",
        textAlign: "center",
    },
    productButton: {

    }
}));

export default function Cart() {

    const classes = useStyles()
    const dispatch = useDispatch()

    const [products, setProducts] = useState([])
    const [loader_order, setLoaderOrder] = useState(false)
    const [loader_clear, setLoaderClear] = useState(false)

    const show_cart_sm = useSelector(store => store.app.show_cart_sm)

    const enqueueSnackbar = (...args) => {
        dispatch(enqueueSnackbarAction(...args))
    };

    const closeSnackbar = (...args) => {
        dispatch(closeSnackbarAction(...args));
    };
    const placeYourOrder = () => {
        setLoaderOrder(true)
        let openRequest = indexedDB.open('tea', 1);
        openRequest.onsuccess = () => {
            let db = openRequest.result;
            // При успешном открытии вызвали коллбэк передав ему объект БД
            let transaction = db.transaction("products", "readwrite");
            let tea = transaction.objectStore("products");
            let products = tea.getAll();
            products.onsuccess = () => {
                if (products.result.length > 0) {

                    dispatch(addCart(products.result))

                    setTimeout(() => {
                        dispatch(switchShowCartSm(false))
                    }, 250);

                    setTimeout(() => {
                        dispatch(switchShowCart(true))
                    }, 500)

                    setTimeout(() => {
                        setLoaderOrder(false)
                    }, 750);

                } else {

                    setTimeout(() => {
                        setLoaderOrder(false)
                        dispatch(switchShowCartSm(false))
                        enqueueSnackbar({
                            message: "Ваша корзина пуста!",
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
                    }, 500)

                }
            }
        };

    }

    const clearCart = () => {
        dispatch(switchShowCartSm(false));
        setLoaderClear(true);
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
                    setLoaderClear(false);
                    setTimeout(() => {
                        dispatch(refreshCart(false));
                    }, 500);
                }
            }
        };
    }

    const deleteProduct = (id) => {

        let openRequest = indexedDB.open('tea', 1);
        openRequest.onsuccess = () => {
            let db = openRequest.result;
            // При успешном открытии вызвали коллбэк передав ему объект БД
            let transaction = db.transaction("products", "readwrite");
            let tea = transaction.objectStore("products");
            let products = tea.getKey(`${id}`);
            products.onsuccess = function () {
                tea.delete(products.result)
                dispatch(refreshCart(true))
                refreshProds()
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
        let val = elem.value
        if (Number(elem.value) > Number(item.price)) {
            elem.value = Number(val) - Number(item.price)
            item["amount"] = elem.value
            changeItem(item)
        }
    }


    const plusProduct = (e, elem, item) => {
        let val = elem.value
        elem.value = Number(val) + Number(item.price)
        item["amount"] = elem.value
        changeItem(item)
    }


    const returnPhoto = (photo) => {
        let ph = photo.split("/")
        let str = "";
        (ph[0] === "..")
            ? str = ph[2] + "/" + ph[3] + "/" + ph[4]
            : str = photo
        return str
    }

    const returnBlock = (item, length, index) => {
        const ref = React.createRef()
        return <Fragment key={item.id}>
            <div
                className={classes.product}
            >
                <IconButton
                    aria-label="delete"
                    className={classes.deleteButton}
                    onClick={() => deleteProduct(item.id)}
                >
                    <CloseIcon style={{fontSize: "1.1rem"}}/>
                </IconButton>
                <Avatar alt={item.name} variant="rounded" className={classes.imageSm} src={returnPhoto(item.photo)}/>
                <div className={classes.info}>
                    <div className={classes.infoName}>
                        <span className={classes.name}>{item.name}</span>
                        <b className={classes.price}>Цена: {item.price} ₽<br/>{item.unit}</b>
                    </div>
                    <Divider/>
                    <div className={classes.infoQty}>
                        <div className={classes.infoChange}>
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
                        <div className={classes.infoTotal}></div>
                    </div>
                </div>
            </div>
            {
                length > 3 ? length !== index + 1 && <Divider/> : <Divider/>
            }


        </Fragment>
    }

    const refreshProds = () => {
        let openRequest = indexedDB.open('tea', 1);
        openRequest.onsuccess = () => {
            let db = openRequest.result;
            // При успешном открытии вызвали коллбэк передав ему объект БД
            let transaction = db.transaction("products", "readonly");
            let tea = transaction.objectStore("products");
            let products = tea.getAll();
            products.onsuccess = function () {
                setProducts(products.result);
            };
        };
    }


    useEffect(() => {

        if (show_cart_sm) {
            refreshProds()
        }

    }, [show_cart_sm])

    return (
        <Fragment>
            <div className={classes.paper}>
                <div className={classes.cartHeader}>
                    Ваша корзина
                    <span
                        className={classes.clear}
                        onClick={clearCart}
                    >
                        очистить
                        {
                            loader_clear && <CircularProgress size={16} className={classes.loader}/>
                        }
                    </span>
                </div>
                <Divider/>
                <div className={classes.cartBody}>
                    {
                        products &&
                        products.map((item, index) =>
                            returnBlock(item, products.length, index)
                        )
                    }
                </div>
                <Divider/>
                <div className={classes.footer}>
                    <Button
                        className={classes.button}
                        onClick={() => dispatch(switchShowCartSm(false))}
                    >
                        Продолжить покупки
                    </Button>
                    <Button
                        className={classes.makeAPurchase}
                        onClick={placeYourOrder}
                        disabled={loader_order}
                    >
                        Оформить заказ
                        {
                            loader_order && <CircularProgress size={20} className={classes.loaderOrder}/>
                        }
                    </Button>
                </div>

            </div>
        </Fragment>
    );
}