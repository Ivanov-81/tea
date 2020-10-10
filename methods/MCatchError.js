import React from "react"

import {
    lightMistake,
    closeSnackbar,
    enqueueSnackbar, switchLoader,
} from "../actions/actionCreator"

import CloseIcon from "@material-ui/icons/Close"
import {Button} from "@material-ui/core"

export default function MCatchError(dispatch, error, message) {

    const errors = (status, data, statusText) => {

        if (status === 401) {
            dispatch(lightMistake({error: 401}))
            return
        }

        if (status === 404) {
            dispatch(enqueueSnackbar({
                message: message === undefined ? statusText : message,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    action: (key) => (
                        <Button
                            onClick={() => dispatch(closeSnackbar(key))}
                        >
                            <CloseIcon/>
                        </Button>
                    ),
                },
            }))
            return
        }

        if (status === 413) {
            dispatch(enqueueSnackbar({
                message: "Слишком большой файл для загрузки!",
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    action: (key) => (
                        <Button
                            onClick={() => dispatch(closeSnackbar(key))}
                        >
                            <CloseIcon/>
                        </Button>
                    ),
                },
            }))
            return
        }

        if (status === 500) {
            dispatch(lightMistake({error: 500, text: error, data: data}))
            return
        }

        if (status !== 400) {

            dispatch(enqueueSnackbar({
                message: "Упс, возникла 400 ошибка",
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    action: (key) => (
                        <Button
                            onClick={() => dispatch(closeSnackbar(key))}
                        >
                            <CloseIcon/>
                        </Button>
                    ),
                },
            }))

        }

    }

    if (typeof error['response'] !== "undefined") {
        const {status, data, statusText} = error.response
        errors(status, data, statusText)
    }
    else if(typeof error['response'] !== undefined) {
        errors(error.status, error.data, error.statusText)
    }
    else {
        dispatch(enqueueSnackbar({
            message: "Упс, возникла непредвиденная ошибка",
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'error',
                action: (key) => (
                    <Button
                        onClick={() => dispatch(closeSnackbar(key))}
                    >
                        <CloseIcon/>
                    </Button>
                ),
            },
        }))
    }

    dispatch(switchLoader(false));

    return null;
}
