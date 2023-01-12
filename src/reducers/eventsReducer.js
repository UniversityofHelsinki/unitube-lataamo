
const initialState = {
    videos: [],
    inboxVideos: [],
    trashVideos: [],
    deletionDate : '',
    event: {
        title : '',
        description: ''
    },
    licenses: []
};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_EVENTS':
        return {
            ...state,
            videos: action.payload,
            loading: action.loading
        };
    case 'SUCCESS_API_GET_DELETION_DATE':
        return {
            ...state,
            deletionDate : action.payload.deletionDate
        };
    case 'FAILURE_API_GET_DELETION_DATE':
        return {
            ...state,
            apiError: action.payload,
            deletionDate: ''
        };
    case 'SUCCESS_API_GET_INBOX_EVENTS':
        return {
            ...state,
            inboxVideos: action.payload,
            loading: action.loading
        };
    case 'SUCCESS_API_GET_INBOX_EVENTS_WITHOUT_SETTING_LOADING':
        return {
            ...state,
            inboxVideos: action.payload
        };
    case 'SUCCESS_API_GET_TRASH_EVENTS':
        return {
            ...state,
            trashVideos: action.payload,
            loading: action.loading
        };
    case 'GET_EVENTS_REQUEST':
        return {
            ...state,
            loading: action.loading
        };
    case 'SUCCESS_API_GET_EVENT':
        return {
            ...state,
            event: action.payload
        };
    case 'DESELECT_EVENT':
        return {
            ...state,
            event: {
                title : '',
                description: ''
            }
        };
    case 'PROCESSING_STATE_UPDATE':
        return {
            ...state,
            event: action.payload
        };

    case 'SUCCESS_API_GET_LICENSES':
        return {
            ...state,
            licenses: action.payload
        };
    default:
        return state;
    }
};

export default eventsReducer;
