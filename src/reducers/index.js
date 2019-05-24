import { combineReducers } from 'redux';
import rotateReducer from './rotateReducer';
import videosReducer from './videosReducer';
import statusReducer from './statusReducer';

const rootReducer = combineReducers({
  rotate: rotateReducer,
  vr: videosReducer,
  sr: statusReducer
});

export default rootReducer;