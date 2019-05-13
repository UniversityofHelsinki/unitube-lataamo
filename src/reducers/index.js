import {combineReducers} from 'redux';
import rotateReducer from './rotateReducer'
import videosReducer from './videosReducer';

const rootReducer = combineReducers({
    rotate: rotateReducer,
    vr: videosReducer
});

export default rootReducer;