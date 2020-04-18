import {
    ADD_EVENT,
    CLOSE_SNACKBAR,
    ENQUEUE_SNACKBAR,
    REMOVE_SNACKBAR,
    ADD_GROUPS,
    ADD_PRODUCTS,
    SWITCH_LOADER,
    SWITCH_AUTHORIZATION, SWITCH_CART, SWITCH_CART_SM, REFRESH_CART, ADD_CART
} from "../js/constants";

export const addEvent = ( event ) => ({
    type : ADD_EVENT,
    event
});

export const enqueueSnackbar = (notification) => {

    const key = notification.options && notification.options.key;

    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            ...notification,
            key: key || new Date().getTime() + Math.random(),
        },
    };
};

export const closeSnackbar = (key) => ({
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
});

export const removeSnackbar = (key) => ({
    type: REMOVE_SNACKBAR,
    key,
});

export const refreshCart = (refresh_cart) => ({
    type : REFRESH_CART,
    refresh_cart
});

export const switchShowCart = (show_cart) => ({
    type : SWITCH_CART,
    show_cart
});

export const switchShowCartSm = (show_cart_sm) => ({
    type : SWITCH_CART_SM,
    show_cart_sm
});

export const switchLoader = (loader) => ({
    type : SWITCH_LOADER,
    loader
});

export const switchAuthorization = (authorization) => ({
    type : SWITCH_AUTHORIZATION,
    authorization
});

export const addGroups = (groups) => ({
    type : ADD_GROUPS,
    groups
});

export const addProducts = (products) => ({
    type : ADD_PRODUCTS,
    products
});

export const addCart = (cart) => ({
    type : ADD_CART,
    cart
});