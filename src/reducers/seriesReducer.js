const initialState = {
    series: [],
    serie: {
        title : '',
        description: ''
    },
    selectedRowId: ''
};

const seriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SUCCESS_API_GET_SERIES':
            return {
                ...state,
                series: action.payload
            };
        case 'SUCCESS_API_GET_SERIE':
            return {
                ...state,
                serie: action.payload,
                selectedRowId: action.selectedRowId
            };
        default:
            return state;
    }
};

export default seriesReducer;