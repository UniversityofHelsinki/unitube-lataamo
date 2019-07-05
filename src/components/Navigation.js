import React, { useEffect }  from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-redux-i18n';
import routeAction from '../actions/routeAction';
import { connect } from 'react-redux';

function Navigation (props) {
    useEffect(() => {
        props.setInitialRoute('home');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return(
        <div className="navigation-row">
            <div className="portlet-content">
                <nav id="navigation">
                    <ul id="mainmenu">
                        <li className={props.route === 'home' ? 'main-nav-item active' : 'main-nav-item'} >
                            <Link to="/" className="menuitem" onClick={() => props.onRouteChange( 'home')} ><Translate value="videos" /></Link>
                        </li>
                        <li className={props.route === 'series' ? 'main-nav-item active' : 'main-nav-item'}>
                            <Link to="/series" className="menuitem" onClick={() => props.onRouteChange( 'series')}><Translate value="series" /></Link>
                        </li>
                    </ul>
                </nav>
                <div className="clear"></div>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    route: state.rr.route
});

const mapDispatchToProps = dispatch => ({
    setInitialRoute: (route) => dispatch(routeAction(route)),
    onRouteChange: (route) => {
        dispatch(routeAction(route));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
