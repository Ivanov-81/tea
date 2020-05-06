import React, {useEffect, useState} from "react"

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
        "& li": {
            height: "30px",
            minHeight: "30px",
            "& div": {
                height: "100%",
                display: "flex",
                alignItems: "center",
            }
        }
    },
    groupMain: {}
}));

export default function Menu(props) {

    const classes = useStyles();

    const g = useSelector(store => store.catalogs.groups)
    const p = useSelector(store => store.catalogs.products)

    const [groups, setGroups] = useState([])
    const [products, setProducts] = useState([])

    const onChangeState = () => {
        props.changeWindowState(false);
    };

    useEffect(() => {

        console.log(g)
        console.log(p)
        setGroups(g)

    }, [g, p]);

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
                >
                    {
                        groups.map((item) => {
                            return item.parent_id === "0" &&
                                <TreeItem nodeId={item.id} label={item.name}>
                                    <TreeItem nodeId="2" label="Calendar"/>
                                    <TreeItem nodeId="3" label="Chrome"/>
                                    <TreeItem nodeId="4" label="Webstorm">
                                        <TreeItem nodeId="7" label="src">
                                            <TreeItem nodeId="8" label="index.js"/>
                                            <TreeItem nodeId="9" label="tree-view.js"/>
                                        </TreeItem>
                                    </TreeItem>
                                </TreeItem>
                        })
                    }
                </TreeView>

            </div>

        </section>

    )

}
