import { combineReducers } from 'redux';
import rotateReducer from './rotateReducer';
import videosReducer from './videosReducer';
import { i18nReducer } from 'react-redux-i18n';
import userReducer from './userReducer';
import statusReducer from './statusReducer';

const rootReducer = combineReducers({
    rotate: rotateReducer,
    i18n: i18nReducer,
    vr: videosReducer,
    ur: userReducer,
    sr: statusReducer
});

export default rootReducer;