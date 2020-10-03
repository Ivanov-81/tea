import React from "react";
import axios from "axios";
import {
    addProducts, closeSnackbar,
    enqueueSnackbar, switchLoader
} from "../actions/actionCreator";
import {URL_GET_PRODUCTS} from "../js/Urls";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import models from "../js/models";
import MCatchError from "./MCatchError";


export default function MGetProducts(dispatch) {

    dispatch(switchLoader(true));

    axios.get(URL_GET_PRODUCTS, {})
        .then((result) => {
            const {status, data} = result;
            if (status === 200) {

                console.log(data);

                dispatch(addProducts(data.sort(models.compareName)));

                enqueueSnackbar({
                    message: "Продукты получены!",
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
            MCatchError(dispatch, error)
        })
        .finally(() => {
            dispatch(switchLoader(false));
        });

    return null;
}
