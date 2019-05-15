import React from 'react';


const Video = ({title, duration, owner}) => {

    return (
      <>
        <p>
          <b>Title: </b>{title} <b>duration: </b> {duration} s
        </p>
      </>
    );
  };

  export default Video;
