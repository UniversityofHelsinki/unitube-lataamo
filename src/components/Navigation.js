import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-redux-i18n';
import { connect } from 'react-redux';

function Navigation (props) {
    return(
        <div className="navigation-row">
            <nav id="navigation">
                <ul id="mainmenu">
                    <li className={props.route === 'inbox' ? 'main-nav-item open' : 'main-nav-item'} >
                        <Link to="/" className="menuitem" data-cy="test-inbox-menu"><Translate value="inbox" />
                            <span hidden={props.videos <= 0} className="videos-count">{props.videos >= 100 ? '99+' : props.videos}</span>
                        </Link>
                    </li>
                    <li className={props.route === 'series' ? 'main-nav-item open' : 'main-nav-item'}>
                        <Link to="/series" className="menuitem" data-cy="test-series-menu" ><Translate value="series" /></Link>
                    </li>
                    <li className={props.route === 'events' ? 'main-nav-item open' : 'main-nav-item'} >
                        <Link to="/events" className="menuitem" data-cy="test-events-menu" ><Translate value="videos" /></Link>
                    </li>
                    <li className={props.route === 'trash' ? 'main-nav-item open' : 'main-nav-item'} >
                        <Link to="/trash" className="menuitem" data-cy="test-trash-menu" ><Translate value="trash" /></Link>
                    </li>
                </ul>
            </nav>
            <div className="clear"></div>
        </div>
    );
}

const mapStateToProps = state => ({
    route: state.rr.route,
    videos: state.er.inboxVideos.length
});

export default connect(mapStateToProps)(Navigation);
