import {combineReducers} from 'redux';
import rotateReducer from './rotateReducer'
import apiReducer from './apiReducer';

const rootReducer = combineReducers({
    rotate: rotateReducer,
    api: apiReducer
});

export default rootReducer;