const initialState = {
    series: [],
    seriesDropDown: [],
    serie: {
        title : '',
        description: '',
        published: '',
        moodleNumber: '',
        moodleNumbers: [],
    },
    selectedRowId: '',
    moodleNumbers: [],
    seriesPostSuccessMessage: null,
    seriesPostFailureMessage: null,
    persons: [],
    iamGroups: []
};

const seriesReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_SERIES':
        return {
            ...state,
            series: action.payload,
            loading: action.loading
        };
    case 'SUCCESS_API_GET_SERIES_DROP_DOWN_LIST' :
        return {
            ...state,
            seriesDropDown: action.payload
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
            selectedRowId: action.selectedRowId,
            moodleNumbers: action.payload.moodleNumbers,
            iamGroups: action.payload.iamgroups,
            persons: action.payload.persons,
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
    case 'SUCCESS_API_POST_SERIES':
        return {
            ...state,
            seriesPostSuccessMessage: action.payload
        };
    case 'CLEAR_API_POST_SERIES_SUCCESS_CALL':
        return {
            ...state,
            seriesPostSuccessMessage: action.payload
        };
    case 'FAILURE_API_POST_SERIES':
        return {
            ...state,
            seriesPostFailureMessage: action.payload
        };
    case 'SUCCESS_API_DELETE_SERIES':
        return {
            ...state,
            series: [ ...state.series.filter(serie => serie.identifier !== action.payload.serie.identifier) ],
        };
    case 'STATUS_403_API_CALL':
        return {
            ...state,
            seriesPostFailureMessage: action.payload
        };
    case 'STATUS_500_API_CALL':
        return {
            ...state,
            seriesPostFailureMessage: action.payload
        };
    case 'CLEAR_API_POST_SERIES_FAILURE_CALL':
        return {
            ...state,
            seriesPostFailureMessage: null
        };
    case 'ADD_PERSON':
        return {
            ...state,
            persons : [...new Set([...state.persons, action.payload])],
        };
    case 'REMOVE_PERSON':
        return {
            ...state,
            persons : [...state.persons.filter(person => person !== action.payload)],
        };
    case 'EMPTY_PERSONS':
        return {
            ...state,
            persons : action.payload,
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
    case 'EMPTY_IAM_GROUPS':
        return {
            ...state,
            iamGroups : action.payload,
        };
    default:
        return state;
    }
};

export default seriesReducer;
