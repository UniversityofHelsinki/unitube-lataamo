import { combineReducers } from 'redux';
import rotateReducer from './rotateReducer';
import videosReducer from './videosReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    rotate: rotateReducer,
    vr: videosReducer,
    ur: userReducer
});

export default rootReducer;