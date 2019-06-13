import React, { useEffect }  from 'react';
import { Link } from 'react-router-dom';
import Language from '../components/Language';
import { Translate } from 'react-redux-i18n';
import routeAction from '../actions/routeAction';
import { connect } from 'react-redux';

function Navigation(props) {

    useEffect(() => {
        props.setInitialRoute('home');
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-fixed-top navbar-dark bg-dark main-nav">
                <div className="container">
                    <ul className="nav navbar-nav">
                        <li className={props.route === 'home' ? 'nav-item active' : 'nav-item'} >
                            <Link to="/" className="nav-link" onClick={() => props.onRouteChange( 'home')} ><Translate value="videos" /></Link>
                        </li>
                        <li className={props.route === 'series' ? 'nav-item active' : 'nav-item'}>
                            <Link to="/series" className="nav-link" onClick={() => props.onRouteChange( 'series')}><Translate value="series" /></Link>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav mx-auto">
                        <h2 className='text-white'><Translate value="lataamo"/></h2>
                    </ul>
                    <ul className="nav navbar-nav">
                        <Language />
                    </ul>
                </div>
            </nav>
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
