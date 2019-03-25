import React from 'react';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from "redux-thunk";

import App from '../App';
import {Provider} from "react-redux";
import rotateAction from "../actions/rotateAction";
import getAction from './utils/getAction';

const mockStore = configureStore([thunk]);


describe('<App />', () => {

    let store;
    let wrapper;

    const initialState =  {rotate : {rotating: true}};
    beforeEach(() => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <App />
        </Provider>);
    });


    it('Should render the component with mock store', () => {
        expect(wrapper).not.toBe(null);
        expect(wrapper.contains(<App />)).toEqual(true);
    });


    it('Should render the App component with default values ', () => {
        expect(wrapper.find('button.rotate-button').first().text()).toEqual("STOP ROTATE");
        expect(wrapper.find('img').first().hasClass('App-logo')).toEqual(true);
    });

    it('Should pass actions updated values ', async() => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(rotateAction(false));
        expect(await getAction(store, "rotate")).not.toBe(null);
        expect(await getAction(store, "rotate")).toEqual({
            "type": "rotate",
            "payload": false
        });
    });
});