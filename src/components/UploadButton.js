import { Link } from 'react-router-dom';
import { Translate } from 'react-redux-i18n';
import React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import constants from '../utils/constants';
import WarningMessage from './WarningMessage';
import { fetchInboxEvents } from '../actions/eventsAction';

const UploadButton = (props) => {
    const [alreadyFetched, setAlreadyFetched] = useState(props.alreadyFetched);
    const [loading, setLoading] = useState(!props.alreadyFetched);
    useEffect(() => {
        if (!alreadyFetched) {
            props.fetchInboxEvents();
        }
    }, []);

    useEffect(() => {
        if (loading) {
            setAlreadyFetched(true);
            setLoading(false);
        }
    }, [props.videos]);

    return (
        <div className="margintop row">
            <div className="col-xs-2 col-sm-2 col-md-2">
                <Link to="/uploadVideo" className={`btn btn-primary ${!alreadyFetched || props.loading || props.videos.length >= constants.MAX_AMOUNT_OF_MESSAGES ? 'disabled' : ''}`}>
                    <Translate value="add_video"/>
                </Link>
            </div>
            <div className="col-xs-10 col-sm-10 col-md-10">
                <WarningMessage />
            </div>
        </div>
    );
};


const mapStateToProps = state => ({
    videos: state.er.inboxVideos,
    loading: state.er.loading
});

const mapDispatchToProps = dispatch => ({
    fetchInboxEvents: () => dispatch(fetchInboxEvents(false, true))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadButton);
