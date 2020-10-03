import {
    SWITCH_CART,
    SWITCH_MENU,
    REFRESH_CART,
    SWITCH_LOADER,
    SWITCH_CART_SM,
    SWITCH_AUTHORIZATION, LIGHT_MISTAKE, ADD_DEVICE,
} from "../js/constants";

const defaultState = {
    authorization: false,
    loader: false,
    show_cart: false,
    show_cart_sm: false,
    refresh_cart: false,
    open_menu: false,
    error: {},
    device: false,
};

const app = (state = defaultState, {
    type,
    loader,
    show_cart,
    show_cart_sm,
    authorization,
    refresh_cart,
    open_menu,
    error,
    device,
}) => {

    switch (type) {
        case SWITCH_AUTHORIZATION :
            return Object.assign({}, state, {
                authorization: authorization
            });
        case SWITCH_LOADER :
            return Object.assign({}, state, {
                loader: loader
            });
        case SWITCH_CART :
            return Object.assign({}, state, {
                show_cart: show_cart
            });
        case SWITCH_CART_SM :
            return Object.assign({}, state, {
                show_cart_sm: show_cart_sm
            });
        case SWITCH_MENU :
            return Object.assign({}, state, {
                open_menu: open_menu
            });
        case REFRESH_CART :
            return Object.assign({}, state, {
                refresh_cart: refresh_cart
            });
        case LIGHT_MISTAKE :
            return Object.assign({}, state, {
                error: error
            });
        case ADD_DEVICE :
            return Object.assign({}, state, {
                device: device
            });
        default:
            return state;
    }

};

export default app;
