import { combineReducers } from 'redux';
import videosReducer from './videosReducer';
import { i18nReducer } from 'react-redux-i18n';
import userReducer from './userReducer';
import statusReducer from './statusReducer';
import seriesReducer from './seriesReducer';
import routeReducer from './routeReducer';
import eventsReducer from './eventsReducer';

const rootReducer = combineReducers({
    i18n: i18nReducer,
    vr: videosReducer,
    ur: userReducer,
    sr: statusReducer,
    ser: seriesReducer,
    rr: routeReducer,
    er: eventsReducer
});

export default rootReducer;