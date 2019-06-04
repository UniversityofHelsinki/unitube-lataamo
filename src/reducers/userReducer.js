
const initialState = {
    user: { eppn: '', preferredLanguage: '' }
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_USER':
        return {
            ...state,
            user: action.payload
        };
    case 'LANGUAGE_CHANGE':
        return {
            ...state,
            user : {
                eppn: state.user.eppn,
                preferredLanguage: action.payload
            }
        };
    default:
        return state;
    }
};

export default userReducer;