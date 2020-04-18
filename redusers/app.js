import {
    SWITCH_CART,
    REFRESH_CART,
    SWITCH_LOADER,
    SWITCH_CART_SM,
    SWITCH_AUTHORIZATION,
} from "../js/constants";
import {refreshCart} from "../actions/actionCreator";

const defaultState = {
    authorization: false,
    loader: false,
    show_cart: false,
    show_cart_sm: false,
    refresh_cart: false
};

const app = (state = defaultState, {
    type,
    loader,
    show_cart,
    show_cart_sm,
    authorization,
    refresh_cart
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
        case REFRESH_CART :
            return Object.assign({}, state, {
                refresh_cart: refresh_cart
            });
        default:
            return state;
    }

};

export default app;
