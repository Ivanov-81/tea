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
import {Add} from "@material-ui/icons";

import MChangeArchived from "../../../methods/MChangeArchived";
import MChangePromotion from "../../../methods/MChangePromotion";
import Modal from "@material-ui/core/Modal";
import AddProduct from "./AddProduct";

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
                padding: 0,
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
                padding: '5px 5px',
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
                padding: '10px 0 10px 0',
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
                padding: '5px 5px',
                textAlign: 'left',
                lineHeight: '13px'
            },
        },
        {
            field: 'price',
            title: 'Цена',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 150,
                padding: '10px 0 10px 50px',
                textAlign: 'left',
            },
        },
        {
            field: 'promotion',
            title: 'Акция',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 150,
                padding: '10px 0 10px 55px',
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
            field: 'photo',
            title: 'Фото',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: 200,
                padding: '10px 0 10px 15px',
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
    ]

    let [pageSize] = useState(50)
    const [rows, setRows] = useState([])
    const [open_modal, setOpenModal] = useState(false)

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

    const handlerAddProduct = () => {
        setOpenModal(true)
    };

    const handlerCloseModal= () => {
        setOpenModal(false)
    };

    useEffect(() => {
        MGetProducts(dispatch)
    }, []);

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