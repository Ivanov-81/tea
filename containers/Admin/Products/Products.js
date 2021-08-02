import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import MaterialTable, {MTableToolbar} from 'material-table';

import {makeStyles} from "@material-ui/core/styles";
import {createStyles, IconButton} from "@material-ui/core";

import withStyles from "@material-ui/core/styles/withStyles";
import {green, grey, purple} from "@material-ui/core/colors";
import Checkbox from "@material-ui/core/Checkbox";
import CheckIcon from '@material-ui/icons/Check';

import {tableIcons} from "../../../js/variables"
import MGetProducts from "../../../methods/MGetProducts";
import {Add, Edit} from "@material-ui/icons";

import MChangeArchived from "../../../methods/MChangeArchived";
import MChangePromotion from "../../../methods/MChangePromotion";
import Modal from "@material-ui/core/Modal";
import AddProduct from "./AddProduct";
import MChangeNovelty from "../../../methods/MChangeNovelty";
import axios from "axios";
import {URL_GET_GROUPS} from "../../../js/Urls";
import {addGroups} from "../../../actions/actionCreator";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Price from "../Price/Price";

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

const PurpleCheckbox = withStyles({
    root: {
        color: purple[400],
        '&$checked': {
            color: purple[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

const GreyCheckbox = withStyles({
    root: {
        color: grey[400],
        '&$checked': {
            color: grey[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

const BlueCheckbox = withStyles({
    root: {
        color: "rgba(97, 59, 231, 0.5)",
        '&$checked': {
            color: "rgba(97, 59, 231, 1)",
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

const useStyles = makeStyles(() =>
    createStyles({
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
        name: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
        },
        nameText: {
            display: "flex",
            width: "75%",
            height: "100%",
            paddingLeft: 10,
        },
        units: {
            display: "flex",
            width: "15%",
            height: "100%",
            justifyContent: "flex-end",
            color: "#999999",
            fontSize: "12px",
            paddingRight: 5,
        },
        toolbar: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 0 0 20px !important",
        }
    })
);

export default function Products() {

    const classes = useStyles()
    const dispatch = useDispatch()

    const products = useSelector(store => store.catalogs.products)

    const columns = [
        {
            field: 'name',
            title: 'Название',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                minWidth: 450,
                padding: 16,
                textAlign: 'left',
                lineHeight: '13px',
            },
            render: (data) => {
                return <div className={classes.name}>
                    <span className={classes.nameText}>{data.name}</span>
                    <span className={classes.units}>{data.unit}</span>
                    {
                        data.archived === "0"
                            ? <GreyCheckbox
                                title="Пометить как архивный"
                                checked={false}
                                onChange={handlerChange(data)}
                                value="checkedG"
                            />
                            : <GreenCheckbox
                                title="Ввести в продажу"
                                checked={true}
                                onChange={handlerChange(data)}
                                value="checkedG"
                            />
                    }
                </div>
            }
        },
        {
            field: 'vendor_code',
            title: 'Артикул',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 150,
                padding: 16,
                textAlign: 'left',
            },
        },
        {
            field: 'group_id',
            title: 'Группа',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 135,
                padding: 16,
                textAlign: 'left',
            },
        },
        {
            field: 'upload_date',
            title: 'Загрузка',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 50,
                padding: 16,
                textAlign: 'left',
                lineHeight: '13px'
            },
            render: (data) => {
                function returnData(d) {
                    let date = new Date(Number(d));
                    return [
                        date.getDate(),
                        ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"][date.getMonth()],
                        date.getFullYear()
                    ].join(".")
                }

                return data.upload_date.length === 13
                    ? returnData(data.upload_date)
                    : data.upload_date.split('.').reverse().join('.')
            }
        },
        {
            field: 'price',
            title: 'Цена',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 150,
                padding: 16,
                textAlign: 'left',
            },
            render: (data) => {
                return <Price data={data} />
            }
        },
        {
            field: 'promotion',
            title: 'Акция',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 150,
                padding: 16,
                textAlign: 'left',
            },
            render: (data) => {
                return <div className={classes.name}>
                    {
                        data.promotion === "0"
                            ? <GreyCheckbox
                                title="Добавить в список акционных"
                                checked={false}
                                onChange={handlerChangePromotion(data)}
                                value="checkedP"
                            />
                            : <PurpleCheckbox
                                title="Акционный товар"
                                checked={true}
                                onChange={handlerChangePromotion(data)}
                                value="checkedP"
                            />
                    }
                </div>
            }
        },
        {
            field: 'new',
            title: 'Новинка',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 150,
                padding: 16,
                textAlign: 'left',
            },
            render: (data) => {
                return <div className={classes.name}>
                    {
                        data.new === "0"
                            ? <GreyCheckbox
                                title="Добавить в список новинок"
                                checked={false}
                                onChange={handlerChangeNovelty(data)}
                                value="checkedB"
                            />
                            : <BlueCheckbox
                                title="Новинка"
                                checked={true}
                                onChange={handlerChangeNovelty(data)}
                                value="checkedB"
                            />
                    }
                </div>
            }
        },
        {
            field: 'photo',
            title: 'Фото',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 200,
                padding: 16,
                textAlign: 'left',
            },
            render: (data) => {
                return <div className={classes.name}>
                    {
                        data.photo &&
                        <CheckIcon style={{color: "#66bb6a"}}/>
                    }
                </div>
            }
        },
        {
            field: 'photo',
            title: 'Ред.',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 50,
                padding: 16,
                textAlign: 'left',
            },
            render: (data) => {
                return <IconButton
                    title="Редактировать товар"
                    style={{color: "#73879C"}}
                    onClick={handlerEditProduct(data)}
                >
                    <Edit/>
                </IconButton>
            }
        },
    ]

    let [pageSize] = useState(50)
    const [rows, setRows] = useState([])
    const [open_modal, setOpenModal] = useState(false)
    const [product, setProduct] = useState({})



    const handlerChange = (data) => () => {

        let message = "";

        if (data.archived === "0") {
            data.archived = "1";
            message = "Товар помечен как архивный";
        } else {
            data.archived = "0";
            message = "Товар введён в продажу";

        }

        MChangeArchived(dispatch, data, message)

    };

    const handlerChangePromotion = (data) => () => {

        let message = "";

        if (data.promotion === "0") {
            data.promotion = "1";
            message = "Товар добавлен в список акционных";
        } else {
            data.promotion = "0";
            message = "Товар удалён из списка акционных";
        }

        MChangePromotion(dispatch, data, message)

    };

    const handlerEditProduct = (data) => () => {
        setProduct(data)
        setOpenModal(true)
    };

    const handlerChangeNovelty = (data) => () => {

        let message = "";

        if (data.new === "0") {
            data.new = "1";
            message = "Товар добавлен в список новинок";
        } else {
            data.new = "0";
            message = "Товар удалён из списка новинок";
        }

        MChangeNovelty(dispatch, data, message)

    };

    const handlerAddProduct = () => {
        setProduct({})
        setOpenModal(true)
    };

    const handlerCloseModal = () => {
        setOpenModal(false)
    };

    useEffect(() => {
        MGetProducts(dispatch)
    }, []);

    useEffect(() => {

        if(!open_modal) return

        axios.get(`${URL_GET_GROUPS}?groups=all`)
            .then((result) => {
                const {status, data} = result;
                if (status === 200) {
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

    }, [open_modal]);

    useEffect(() => {

        if (products.length !== 0) {
            setRows(products);
        } else {
            setRows([]);
        }

    }, [products]);

    return (

        <Fragment>

            <Modal
                open={open_modal}
                onClose={handlerCloseModal}
                disableBackdropClick
            >
                <AddProduct
                    product={product}
                    state={open_modal}
                    closeModal={handlerCloseModal}
                />
            </Modal>

            <MaterialTable
                title={
                    <div className={classes.toolbar}>
                        <h3 style={{margin: "0 15px 0 0"}}>Товары</h3>
                        <IconButton
                            title="Добавить товар"
                            style={{color: "rgb(97, 59, 231)"}}
                            onClick={handlerAddProduct}
                        >
                            <Add/>
                        </IconButton>
                    </div>
                }
                columns={columns}
                data={rows}
                localization={{
                    toolbar: {
                        searchPlaceholder: "Поиск"
                    }
                }}
                options={{
                    maxBodyHeight: 'calc(85vh - 30px)',
                    minBodyHeight: 'calc(85vh - 30px)',
                    headerStyle: {
                        backgroundColor: '#613be7',
                        color: '#ECF0F1',
                        fontSize: '13px',
                    },
                    paginationType: 'normal',
                    draggable: false,
                    pageSize: pageSize,
                    pageSizeOptions: columns.length,
                    search: true,
                    searchFieldAlignment: 'right',
                    searchFieldStyle: {
                        width: 220,
                        fontSize: '14px',
                        marginRight: 15,
                    },
                }}
                icons={tableIcons}
                style={{boxShadow: 'none'}}
                components={{
                    Toolbar: (props) => (
                        <MTableToolbar {...props} />
                    )
                }}
            />

        </Fragment>

    );
}
