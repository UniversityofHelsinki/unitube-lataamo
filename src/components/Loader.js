import React from 'react';

const Loader = (props) => {
    return (
        <div>
            <div className="loader" />
            <p>{props.loading}</p>
        </div>
    );
};

export default Loader;