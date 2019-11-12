const initialState = {
    route: 'inbox'
};

const routeReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'routeChange':
        return {
            ...state,
            route: action.payload
        };
    default:
        return state;
    }
};

export default routeReducer;