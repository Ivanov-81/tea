import React from "react";
import axios from "axios";
import {
    switchLoader, updateApp,
    closeSnackbar, enqueueSnackbar
} from "../actions/actionCreator";
import {URL_CHANGE_PROMOTION} from "../js/Urls";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import MCatchError from "./MCatchError";

export default function MChangePromotion(dispatch, data, message) {

    dispatch(switchLoader(true));

    axios.post(
        URL_CHANGE_PROMOTION,
        {id: data.id, promotion: data.promotion}
    )
        .then((result) => {
            const {status, data} = result;
            if (status === 200) {

                if(data.result) {

                    dispatch(updateApp(true))

                    dispatch(enqueueSnackbar({
                        message: message,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                            action: (key) => (
                                <Button onClick={() => dispatch(closeSnackbar(key))}>
                                    <CloseIcon/>
                                </Button>
                            ),
                        },
                    }));

                }

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
