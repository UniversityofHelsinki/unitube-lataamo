
const initialState = {
    videoFiles: [],
    selectedRowId: '',
    transcriptionProcessStatus: ''
};

const videosReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_VIDEO':
        return {
            ...state,
            videoFiles: action.payload,
            selectedRowId: action.selectedRowId
        };
    case 'DESELECT_ROW':
        return {
            selectedRowId: ''
        };
    case 'TRANSCRIPTION_PROCESS_STATUS':
        return {
            ...state,
            transcriptionProcessStatus: action.payload
        };
    default:
        return state;
    }
};

export default videosReducer;
