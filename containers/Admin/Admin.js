import React, {useState} from 'react'
import {Link} from "react-router-dom"
import PropTypes from 'prop-types'
import {useHistory} from "react-router"

import Products from "./Products/Products"
import Orders from "./Orders/Orders"

import {makeStyles} from "@material-ui/core/styles"
import {createStyles} from "@material-ui/core"

import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Tab from "@material-ui/core/Tab"

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) =>
    createStyles({
        main: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
        },
        link: {
            position: "fixed",
            top: "18px",
            right: "25px",
            color: "#BA975F",
            zIndex: 1,
            fontSize: "13px",
        },
        tabPanel: {
            height: "100vh",
            "& div": {
                padding: "0 0 0 0",
            }
        }
    })
);

export default function Admin() {

    const classes = useStyles();
    const history = useHistory();

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 2) history.push("/")
    };

    return (
        <section className={classes.main}>

            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Товары" {...a11yProps(0)}/>
                    <Tab label="Заказы" {...a11yProps(1)}/>
                    <Tab label="На главную" {...a11yProps(2)}>
                        <Link to="/" className={classes.link}>На главную</Link>
                    </Tab>
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} className={classes.tabPanel}>
                <Products/>
            </TabPanel>
            <TabPanel value={value} index={1} className={classes.tabPanel}>
                <Orders/>
            </TabPanel>
            <TabPanel value={value} index={2} className={classes.tabPanel}>
                Item Three
            </TabPanel>

        </section>
    );
}