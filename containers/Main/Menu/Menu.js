import React, {Fragment, useEffect, useState} from "react"

import clsx from "clsx";

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {createStyles} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import {useSelector} from "react-redux";
import axios from "axios";
import {URL_GET_PRODUCTS} from "../../../js/Urls";

const useStyles = makeStyles((theme) => createStyles({
    menu: {
        position: "fixed",
        right: "0",
        top: "0",
        height: "calc(100vh - 0px)",
        width: "0",
        overflow: "hidden",
        margin: "0",
        display: "flex",
        transition: "all .2s ease-in-out",
        zIndex: 1250,
        background: "#D9C4A5",
        color: "#041715"
    },
    openMenu: {
        width: "300px",
        boxShadow: "-4px 4px 25px rgba(0, 0, 0, 0.2)",
    },
    closeWin: {
        position: "absolute",
        right: "10px",
        top: "10px",
        width: "40px",
        height: "40px",
        padding: "8px"
    },
    body: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        padding: "30px 15px 15px",
        overflowX: "hidden",
        overflowY: "auto",
    },
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
        "& ul": {
            marginLeft: "0px",
        },
        "& li": {
            "& ul": {
                "& div": {
                    lineHeight: "12px"
                }
            },
            minHeight: "35px",
            "& div :first-child": {
                height: "100%",
                minHeight: "35px",
                alignItems: "center",
            }
        }
    },
    groupMain: {}
}));

export default function Menu(props) {

    const classes = useStyles();

    const g = useSelector(store => store.catalogs.groups)

    const [groups, setGroups] = useState([])
    const [products, setProducts] = useState([])
    const [data, setData] = useState({
        id: "root",
        name: "Меню",
        children: []
    })

    const onChangeState = () => {
        props.changeWindowState(false);
    };


    const renderTree = (nodes) => {
        return <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={nodes.name}
        >
            {
                Array.isArray(nodes.children)
                    ? nodes.children.map((node) => renderTree(node))
                    : null
            }
        </TreeItem>
    };

    // useEffect(() => {
    //
    //     console.log(g);
    //
    //     setGroups(g)
    //
    //     if (g.length !== 0) {
    //
    //         let arr = [],
    //             obj = data;
    //
    //         g.map((item) => {
    //
    //             if (item.parent_id === "0") {
    //
    //                 axios.post(URL_GET_PRODUCTS, {group: Number(item.id)}, {})
    //                     .then((result) => {
    //                         const {status, data} = result;
    //                         if (status === 200) {
    //                             arr.push({id: item.id, name: item.name, children: data.sub_groups})
    //                         }
    //                     })
    //
    //             }
    //
    //         })
    //
    //         obj.children = arr
    //
    //         setData(obj)
    //
    //     }
    //
    // }, [g]);

    useEffect(() => {
        if (data.length !== 0) {
            // console.log(data)
        }
    }, [data]);

    return (

        <section className={props.open_menu ? clsx(classes.menu, classes.openMenu) : classes.menu}>

            <IconButton
                aria-label="delete"
                className={classes.closeWin}
                onClick={onChangeState}
            >
                <CloseIcon/>
            </IconButton>

            <div className={classes.body}>

                <TreeView
                    className={classes.root}
                    defaultCollapseIcon={<ExpandMoreIcon/>}
                    defaultExpandIcon={<ChevronRightIcon/>}
                    defaultExpanded={["root"]}
                >
                    <Fragment>
                        {
                            renderTree(data)
                        }
                    </Fragment>
                </TreeView>

            </div>

        </section>

    )

}
