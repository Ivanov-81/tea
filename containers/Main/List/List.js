import React, { useState } from 'react'

import { makeStyles } from "@material-ui/core/styles"
import { createStyles } from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close'
import IconButton from "@material-ui/core/IconButton"

const useStyles = makeStyles((theme) => createStyles({
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "36px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "19px",
    },
    closeButton: {
        display: "flex",
        position: "absolute",
        right: 0,
        margin: "0 5px 0 0",
        color: "#FF0000",
    },
    body: {
        position: "relative",
        width: "100%",
        height: "calc(100% - 36px)",
        overflowX: "hidden",
        overflowY: "auto",
        // borderTop: "1px solid #D5BC9C",
        padding: "5px 15px",
    },
    subgroup: {
        position: "relative",
        fontSize: "14px",
        fontWeight: 500,
        color: "#000000",
        textAlign: "left",
        padding: "10px 5px",
        margin: "0 0 0 0",
        cursor: "pointer",
    },
    productsBody: {},
    products: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: "50%",
        height: "25px",
        fontSize: "13px",
        fontWeight: 400,
        overflow: "hidden",
        cursor: "pointer",
        color: "#666666",
        lineHeight: "13px",
        padding: "0 15px 0 0",
    },
}));

export default function List(props) {

    const classes = useStyles();

    const handlerCloseList = () => {
        props.closeList(false);
    };

    const handlerShowProduct = (el) => {
        props.handlerShowProduct(el);
    };

    const {item, sub_groups, products} = props;

    return (
        <>

            <div className={classes.header}>
                {item.name}
                <IconButton
                    onClick={handlerCloseList}
                    className={classes.closeButton}
                    size="small"
                >
                    <CloseIcon fontSize="inherit"/>
                </IconButton>
            </div>

            <div className={classes.body}>

                {
                    sub_groups &&
                        sub_groups.map((elem) => (
                            <div key={elem.id}>
                                <div className={classes.subgroup}>
                                    {elem.name}
                                </div>
                                <div className={classes.productsBody}>
                                    {
                                        products &&
                                            products.map((el, ind) => ((elem.id === el.group_id) ?
                                                    <div
                                                        key={el.id}
                                                        className={classes.products}
                                                        onClick={() => handlerShowProduct(el)}
                                                    >
                                                        {el.name}
                                                    </div> : null
                                            ))
                                    }
                                </div>
                            </div>
                        ))
                }

            </div>

        </>
    );
}
