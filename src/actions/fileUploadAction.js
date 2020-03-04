export const fileUploadProgressAction = (data) => ({
    type: 'UPDATE_PROGRESS',
    payload: data
});

export const fileUploadSuccessActionMessage = (data) => ({
    type: 'FILE_UPLOAD_SUCCESS',
    payload: data
});

export const fileUploadFailedActionMessage = (data) => ({
    type: 'FILE_UPLOAD_FAILED',
    payload: data
});

export const actionEmptyFileUploadProgressSuccessMessage = () => ({
    type: 'EMPTY_PROGRESS_SUCCESS_MESSAGE',
    payload: null
});

export const actionEmptyFileUploadProgressErrorMessage = () => ({
    type: 'EMPTY_PROGRESS_ERROR_MESSAGE',
    payload: null
});

export const textFileUploadSuccessActionMessage = (data) => ({
    type: 'TEXT_FILE_UPLOAD_SUCCESS',
    payload: data
});

export const textFileUploadFailedActionMessage = (data) => ({
    type: 'TEXT_FILE_UPLOAD_FAILED',
    payload: data
});