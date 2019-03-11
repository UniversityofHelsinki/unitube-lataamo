import {combineReducers} from 'redux';
import rotateReducer from './rotateReducer'

const rootReducer = combineReducers({
    rotate: rotateReducer
});

export default rootReducer;