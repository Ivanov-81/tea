import {
    ADD_CART,
    ADD_GROUPS,
    ADD_PRODUCTS,
} from "../js/constants";

const defaultState = {
    groups: [],
    products: [],
    cart: []
};

const catalogs = (state = defaultState, {type, groups, products, cart}) => {

    switch (type) {
        case ADD_GROUPS :
            return Object.assign({}, state, {
                groups: groups
            });
        case ADD_PRODUCTS :
            return Object.assign({}, state, {
                products: products
            });
        case ADD_CART :
            return Object.assign({}, state, {
                cart: cart
            });
        default:
            return state;
    }

};

export default catalogs;
