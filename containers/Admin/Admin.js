import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Link, useHistory} from "react-router-dom"
import MaterialTable, {Icons, MTableToolbar} from 'material-table'

import {makeStyles, createMuiTheme} from "@material-ui/core/styles"
import {createStyles} from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close'

import {forwardRef} from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import axios from "axios";
import {
    addGroups, addProducts,
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction
} from "../../actions/actionCreator";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import {green} from "@material-ui/core/colors";
import withStyles from "@material-ui/core/styles/withStyles";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

const useStyles = makeStyles((theme) => createStyles({
    block: {
        position: "relative",
        display: "flex",
        width: "100%",
        height: "52px",
        color: "#BA975F",
        flexDirection: "column",
        backgroundColor: "#041715",
    },
    link: {
        position: "fixed",
        top: "18px",
        right: "25px",
        color: "#BA975F",
        zIndex: 1,
        fontSize: "13px",
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
    checkbox: {
        display: "flex",
        height: "100%"
    }
}));

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

export default function Admin() {

    const classes = useStyles();
    const dispatch = useDispatch();
    // const history = useHistory();
    // const theme = createMuiTheme({});

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
                console.log(data.archived);
                return <div className={classes.name}>
                    <span className={classes.nameText}>{data.name}</span>
                    <span className={classes.units}>{data.unit}</span>
                    <GreenCheckbox
                        checked={data.archived}
                        onChange={handleChange(data.id)}
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
            title: 'Дата загрузки',
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

            }
        },
    ];

    let [pageSize, setPageSize] = useState(100);
    const [height, setHeight] = useState(10);
    const [rows, setRows] = useState([]);

    const handleChange = (id) => (e) => {
        console.log(id);
    };

    const enqueueSnackbar = (...args) => {
        dispatch(enqueueSnackbarAction(...args))
    };

    const closeSnackbar = (...args) => {
        dispatch(closeSnackbarAction(...args));
    };

    useEffect(() => {
        axios.get('/products.php', {
            // headers: {
            //     Authorization: 'Bearer ' + models.getCookie('Authorization')
            // }
        })
            .then((result) => {
                const {status, data} = result;
                if (status === 200) {

                    console.log(data);

                    dispatch(addProducts(data));

                    setRows(data);

                    enqueueSnackbar({
                        message: "Данные получены!",
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


                }
            })
            .catch(error => {

                if (typeof error.response !== "undefined") {
                    const {status} = error.response;

                } else {
                    console.log(error);
                }

            });
    }, []);

    return (
        <Fragment>
            <section className={classes.block}>

                <Link to="/" className={classes.link}>На главную</Link>

            </section>

            <MaterialTable
                title="Название"
                columns={columns}
                data={rows}
                options={{
                    maxBodyHeight: "70vh",
                    minBodyHeight: "70vh",
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

        </Fragment>
    );
}