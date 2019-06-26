import React, { useEffect }  from 'react';
import { Link } from 'react-router-dom';
import Language from '../components/Language';
import { Translate } from 'react-redux-i18n';
import routeAction from '../actions/routeAction';
import { connect } from 'react-redux';

function Navigation(props) {

    useEffect(() => {
        props.setInitialRoute('home');
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                <h3 className='text-white'>Lataamo</h3>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav ml-auto">
                        <li className={props.route === 'home' ? 'nav-item active' : 'nav-item'} >
                            <Link to="/" className="nav-link" onClick={() => props.onRouteChange( 'home')} ><Translate value="videos" /></Link>
                        </li>
                        <li className={props.route === 'series' ? 'nav-item active' : 'nav-item'}>
                            <Link to="/series" className="nav-link" onClick={() => props.onRouteChange( 'series')}><Translate value="series" /></Link>
                        </li>
                    </ul>
                    <ul className='navbar-nav ml-auto'>
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
