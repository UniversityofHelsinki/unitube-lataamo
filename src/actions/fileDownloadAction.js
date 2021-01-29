export const fileDownloadProgressAction = (data) => ({
    type: 'DOWNLOAD_PROGRESS',
    payload: data
});

export const fileDownloadTimeRemainingProgressAction = (data) => ({
    type: 'DOWNLOAD_REMAINING_TIME',
    payload: data
});
