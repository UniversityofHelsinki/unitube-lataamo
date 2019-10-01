
const initialState = {
    series: [],
    serie: {
        title : '',
        description: ''
    },
    selectedRowId: '',
    moodleNumbers: [],
    iamGroups: []
};

const seriesReducer = (state = initialState, action) => {
    console.log(action.type);
    console.log(action.payload);
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
    case 'ADD_IAM_GROUP':
        return {
            ...state,
            iamGroups : [...new Set([...state.iamGroups, action.payload])],
        };
    case 'REMOVE_IAM_GROUP':
        return {
            ...state,
            iamGroups : [...state.iamGroups.filter(iamGroup => iamGroup !== action.payload)],
        };
    default:
        return state;
    }
};

export default seriesReducer;