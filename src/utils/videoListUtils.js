import React from 'react';
import moment from 'moment';

import VideoDetailsForm from '../components/VideoDetailsForm';
import Loader from '../components/Loader';
import { downloadVideo } from '../actions/videosAction';
import {
    VIDEO_LIST_POLL_INTERVAL,
    VIDEO_PROCESSING_INSTANTIATED,
    VIDEO_PROCESSING_RUNNING,
    VIDEO_PROCESSING_SUCCEEDED } from './constants';

const eventNotSelectable = (processingState) => {
    return (processingState && (processingState !== VIDEO_PROCESSING_SUCCEEDED));
};

export const nonSelectableRows = (videos) => {
    let nonSelectableArray = [];
    videos && videos.forEach(video => {
        if (eventNotSelectable(video.processing_state)) {
            nonSelectableArray.push(video.identifier);
        }
    });
    return nonSelectableArray;
};

export const rowStyle = (row) => {
    const style = {};
    if (eventNotSelectable(row.processing_state)) {
        style.backgroundColor = '#f4f5f9';
    }
    return style;
};

export const getFileName = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
};

export const paginationOptions = {
    sizePerPageList: [{
        text: '5', value: 5
    }, {
        text: '10', value: 10
    }, {
        text: '30', value: 30
    }]
};

export const dateFormatter = (cell) => {
    return moment(cell).utc().format('DD.MM.YYYY HH:mm:ss');
};

export const stateFormatter = (cell, row, inbox) => {
    if (cell === VIDEO_PROCESSING_SUCCEEDED){
        return translate('event_succeeded_state');
    } else if (cell === VIDEO_PROCESSING_INSTANTIATED || cell === VIDEO_PROCESSING_RUNNING) {
        return translate('event_running_and_instantiated_state');
    } else {
        return (
            <div>
                {translate('event_failed_state')}
                <button id={row.identifier} className="btn delete-button delete-button-list" onClick={(e) => deleteEvent(e,row)}>{translate('delete_event')}</button>
            </div>
        );
    }
};

export const downloadHandler = async (event, errorHandler, errorMessage) => {
    if (event) {
        event.persist();
        event.preventDefault();
        event.stopPropagation();
        event.target.downloadIndicator.removeAttribute('hidden');
        let elements = document.getElementsByClassName('disable-enable-buttons');
        let array = [ ...elements ];
        array.map(element => element.setAttribute('disabled', 'disabled'));
        const data = { 'mediaUrl':  event.target.mediaUrl.value };
        const fileName = getFileName(event.target.mediaUrl.value);
        errorHandler(errorMessage);
        try {
            await downloadVideo(data, fileName);
        } catch (error) {
            errorHandler(errorMessage);
        }
        elements = document.getElementsByClassName('disable-enable-buttons');
        array = [ ...elements ];
        array.map(element => element.removeAttribute('disabled'));
        event.target.downloadIndicator.setAttribute('hidden', true);
    }
};

export const hideErrorMessageAfter = (errorMessageSetter, timeOut) => {
    const interval = setInterval( () => {
        errorMessageSetter(null);
    }, timeOut);
    return () => clearInterval(interval);
};

export const noDataIndication = (loading, message) => {
    return loading ? <Loader/> : message;
};

export const getExpandRowProps = (videos, onSelectEvent, inbox) => {
    return {
        parentClassName: 'parent-expand',
        renderer: row => (
            <VideoDetailsForm inbox={inbox}/>
        ),
        onlyOneExpanding: true,
        onExpand: (row, isExpand, rowIndex, e) => {
            if (isExpand) {
                onSelectEvent(row);
            }
        },
        nonExpandable: nonSelectableRows(videos)
    };
};

export const viewErrorMessage = (props, setErrorMessage, message) => {
    props.onFetchEvents(true);
    props.onRouteChange(props.route);
    if (props.apiError) {
        setErrorMessage(message);
    }
    const interval = setInterval(() => {
        props.onFetchEvents(false);
    }, VIDEO_LIST_POLL_INTERVAL);
    return () => clearInterval(interval);
};

export const updateProcessedEventInfo = (props) => {
    const interval = setInterval(() => {
        props.onFetchEvents(false);
        if (props.selectedRowId && props.videos) {
            let selectedEvent = props.videos.find(event => event.identifier === props.selectedRowId);
            if (selectedEvent && selectedEvent.processing_state && selectedEvent.processing_state === VIDEO_PROCESSING_SUCCEEDED) {
                props.onSelectEvent({ identifier: props.selectedRowId });
            }
        }
    }, VIDEO_LIST_POLL_INTERVAL);
    return () => clearInterval(interval);
};
