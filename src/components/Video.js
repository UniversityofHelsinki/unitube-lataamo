import React from 'react';


const Video = ({name, length, owner}) => {

    return (
      <>
        <p>
          <b>Title: </b>{name} <b>length: </b> {length} s
        </p>
      </>
    );
  };

  export default Video;
