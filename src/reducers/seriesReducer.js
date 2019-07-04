
const initialState = {
    series: []
};

const seriesReducer = (state = initialState, action) => {
    console.log(action.type);
    switch (action.type) {
    case 'SUCCESS_API_GET_SERIES':
        return {
            ...state,
            series: action.payload
        };
    default:
        return state;
    }
};

export default seriesReducer;