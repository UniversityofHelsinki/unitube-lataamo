import {combineReducers} from 'redux';
import rotateReducer from './rotateReducer'
import videosReducer from './videosReducer';
import { i18nReducer } from 'react-redux-i18n';

const rootReducer = combineReducers({
    rotate: rotateReducer,
    vr: videosReducer,
    i18n: i18nReducer
});

export default rootReducer;