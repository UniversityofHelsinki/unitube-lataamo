const initialState = {
    route: 'home'
};

const rotateReducer = (state = initialState, action) => {
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

export default rotateReducer;