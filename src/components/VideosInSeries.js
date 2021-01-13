import React , { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FiCopy } from 'react-icons/fi';
import { Badge } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import Alert from 'react-bootstrap/Alert';
import { FaFilm } from 'react-icons/fa';

const VideoInSeries = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];
    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [hovered, setHovered] = useState(false);

    const toggleHover = () => {
        setHovered(!hovered);
    };

    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        setSuccessMessage(null);
    }, [props.series]);

    const copyTextToClipboard = (id, event) => {
        event.preventDefault();
        event.persist();
        let eventId = document.createElement('input');
        document.body.appendChild(eventId);
        eventId.value = id;
        eventId.select();
        //for mobile devices
        eventId.setSelectionRange(0,99999);
        document.execCommand('copy');
        eventId.remove();
        setSuccessMessage(translate('video_id_copied_to_clipboard'));
    };

    const drawSelections = () => {
        if (props.series.eventColumns && props.series.eventColumns.length > 0) {
            return props.series.eventColumns.map((selection, index) => {
                return (
                    <div key={ index } className="form-check-inline video-single">
                        <span className="border">
                            <Badge variant='light'>
                                <FaFilm/>
                                <span className="pl-2 test-video-in-series-title" data-cy="test-video-in-series-title">
                                    { selection.title }
                                </span>
                                <span className="pl-2">
                                    <IconContext.Provider value={{ size: '1.5em' }}>
                                        <FiCopy className={hovered ? 'cursor-pointer' : ''} onMouseEnter={toggleHover} onMouseLeave={toggleHover}
                                            onClick={(event) => { copyTextToClipboard(selection.id, event);}} >{translate('copy_to_clipboard')}
                                        </FiCopy>
                                    </IconContext.Provider>
                                </span>
                            </Badge>
                        </span>
                    </div>
                );
            });
        }
    };

    return (
        <div>
            { successMessage !== null ?
                <Alert variant="success" onClose={ () => setSuccessMessage(null) } dismissible>
                    <p>
                        { successMessage }
                    </p>
                </Alert>
                : (<></>)
            }
            { drawSelections() }
        </div>
    );
};

const mapStateToProps = state => ({
    series: state.ser.serie,
    i18n: state.i18n
});

export default connect(mapStateToProps, null) (VideoInSeries);
