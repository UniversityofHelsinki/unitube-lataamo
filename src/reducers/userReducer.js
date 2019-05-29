
const initialState = {
    user: {}
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_USER':
        return {
            ...state,
            user: action.payload
        };
    default:
        return state;
    }
};

export default userReducer;