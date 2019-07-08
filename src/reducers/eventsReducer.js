
const initialState = {
    event: {
        title : '',
        description: ''
    }
};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_EVENT':
        return {
            ...state,
            event: action.payload
        };
    default:
        return state;
    }
};

export default eventsReducer;