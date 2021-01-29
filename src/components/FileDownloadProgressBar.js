import React, { useEffect  } from 'react';
import { connect } from 'react-redux';
import {fileDownloadProgressAction} from "../actions/fileDownloadAction";

const FileDownloadProgressbar = (props) => {

    const containerStyles = {
        height: 20,
        width: '100%',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        marginTop: 20
    }

    const fillerStyles = {
        height: '100%',
        width: `${props.percentage}%`,
        backgroundColor: '#0da1d4',
        backgroundImage: 'linear-gradient(90deg, #0da1d4 0%, #1dd07e 100%)',
        borderRadius: 'inherit',
        textAlign: 'right'
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }

    useEffect(() => {
        props.onRemoveProgressBar(); // reset progress when component loads
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <div hidden={props.percentage === 0} style={containerStyles}>
                <div style={fillerStyles}>
                    <span style={labelStyles}>{`${props.percentage}%`}</span>
                </div>
            </div>
            <p hidden={props.percentage === 0 || props.percentage === 100}>Tallenteen lataus käynnissä</p>
        </div>
    );
};

const mapStateToProps = state => ({
    percentage : state.fdr.percentage
});

const mapDispatchToProps = dispatch => ({
    onRemoveProgressBar : () => dispatch(fileDownloadProgressAction(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileDownloadProgressbar);
