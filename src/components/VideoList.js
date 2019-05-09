import React from 'react';
import Video from './Video';
import { connect } from "react-redux";


const VideoList = (props) => {

    const renderVideos = () => props.api.videos.map(video =>
      <Video key={video.id} 
            id={video.id} 
            name={video.name} 
            length={video.length} 
            owner={video.owner}/>
    )
  
    return (    
      <div>
        {renderVideos()}
      </div>
    );
};

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, null)(VideoList);