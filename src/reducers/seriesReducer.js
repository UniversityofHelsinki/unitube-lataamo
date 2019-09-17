
const initialState = {
    series: []
};

const seriesReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_SERIES':
        return {
            ...state,
            series: action.payload,
            loading: action.loading
        };
    case 'GET_SERIES_REQUEST':
        return {
            ...state,
            loading: action.loading
        };
    default:
        return state;
    }
};

export default seriesReducer;