import { combineReducers } from 'redux';
import rotateReducer from './rotateReducer';
import videosReducer from './videosReducer';
import userReducer from './userReducer';
import statusReducer from './statusReducer';

const rootReducer = combineReducers({
    rotate: rotateReducer,
    vr: videosReducer,
    ur: userReducer,
    sr: statusReducer
});

export default rootReducer;