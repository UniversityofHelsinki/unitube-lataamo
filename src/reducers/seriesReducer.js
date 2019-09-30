
const initialState = {
    series: [],
    serie: {
        title : '',
        description: '',
        published: '',
    },
    selectedRowId: '',
    moodleNumbers: []
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
    case 'SUCCESS_API_GET_SERIE':
        return {
            ...state,
            serie: action.payload,
            selectedRowId: action.selectedRowId
        };
    case 'ADD_MOODLE_NUMBER':
        return {
            ...state,
            moodleNumbers: [...new Set([...state.moodleNumbers, action.payload])],
        };
    case 'REMOVE_MOODLE_NUMBER':
        return {
            ...state,
            moodleNumbers : [...state.moodleNumbers.filter(moodleNumber => moodleNumber !== action.payload)],
        };
    case 'EMPTY_MOODLE_NUMBER':
        return {
            ...state,
            moodleNumbers : action.payload,
        };
    default:
        return state;
    }
};

export default seriesReducer;