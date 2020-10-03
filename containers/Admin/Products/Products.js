import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import MaterialTable, {MTableToolbar} from 'material-table';

import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";

import Button from "@material-ui/core/Button";

import withStyles from "@material-ui/core/styles/withStyles";
import {green} from "@material-ui/core/colors";
import Checkbox from "@material-ui/core/Checkbox";

import {tableIcons} from "../../../js/variables"
import MGetProducts from "../../../methods/MGetProducts";

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
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
            paddingLeft: "10px",
        },
        units: {
            display: "flex",
            width: "15%",
            height: "100%",
            justifyContent: "flex-end",
            color: "#999999",
            fontSize: "12px"
        },
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
                minWidth: '450px',
                padding: '0px',
                textAlign: 'left',
                lineHeight: '13px',
            },
            render: (data) => {
                return <div className={classes.name}>
                    <span className={classes.nameText}>{data.name}</span>
                    <span className={classes.units}>{data.unit}</span>
                    <GreenCheckbox
                        checked={data.archived === "0"}
                        onChange={() => handleChange(data.id)}
                        value="checkedG"
                    />

                </div>
            }
        },
        {
            field: 'vendor_code',
            title: 'Артикул',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: '150px',
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
                width: '135px',
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
                width: '50px',
                padding: '5px 5px',
                textAlign: 'left',
                lineHeight: '13px'
            },
            render: (data) => {
                return data.upload_date.split(".").reverse().join(".")
            }
        },
        {
            field: 'price',
            title: 'Цена',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: '150px',
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
                width: '150px',
                padding: '10px 0 10px 55px',
                textAlign: 'left',
            },
            render: (data) => {
                console.log(data.promotion)
            }
        },
        {
            field: 'photo',
            title: 'Фото',
            cellStyle: {
                color: '#73879C',
                fontSize: '13px',
                width: '200px',
                padding: '10px 0 10px 15px',
                textAlign: 'left',
            },
            render: (data) => {
                console.log(data.photo)
            }
        },
    ]

    let [pageSize] = useState(50)
    const [rows, setRows] = useState([])

    const handleChange = (id) => {
        console.log(id)
    };

    useEffect(() => {
        MGetProducts(dispatch)
    }, []);

    useEffect(() => {

        if(products.length !== 0) {
            setRows(products);
        }
        else {
            setRows([]);
        }

    }, [products]);

    return (

        <MaterialTable
            title="Товары"
            columns={columns}
            data={rows}
            options={{
                maxBodyHeight: "calc(85vh - 30px)",
                minBodyHeight: "calc(85vh - 30px)",
                headerStyle: {
                    backgroundColor: '#613be7',
                    color: '#ECF0F1',
                    fontSize: '13px',
                },
                paginationType: "normal",
                draggable: false,
                pageSize: pageSize,
                pageSizeOptions: columns.length,
                search: true,
                searchFieldAlignment: 'right',
                searchFieldStyle: {
                    width: "220px",
                    fontSize: "14px",
                    position: "absolute",
                    right: "16px",
                    top: '-12px'
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

    );
}