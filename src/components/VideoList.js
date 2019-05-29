import React, { useEffect } from 'react';
import Video from './Video';
import { connect } from 'react-redux';
import { fetchVideos } from '../actions/videosAction';


const VideoList = (props) => {

    // https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        props.onFetchVideos();
    }, []);

    const renderVideos = () => props.videos.map(video =>
        <Video key={video.identifier}
            id={video.identifier}
            title={video.title}
            duration={video.duration}
            owner={video.creator}/>
    );

    return (
        <div>
            {renderVideos()}
        </div>
    );
};

const mapStateToProps = state => ({
    videos : state.vr.videos
});

const mapDispatchToProps = dispatch => ({
    onFetchVideos: () => dispatch(fetchVideos())
});


export default connect(mapStateToProps, mapDispatchToProps)(VideoList);