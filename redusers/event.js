import {
    ADD_EVENT
} from "../js/constants";

const defaultState = {
    event: null,
};

const event = (state = defaultState, {type, event}) => {
    switch (type) {
        case ADD_EVENT :
            return Object.assign({}, state, {
                event: event
            });
        default:
            return state;
    }

};

export default event;
