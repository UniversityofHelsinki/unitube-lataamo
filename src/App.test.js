import React from 'react';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';

import App from './App';
import {Provider} from "react-redux";

let store;

const buildStore = configureStore();

describe('<App />', () => {

    let store;
    let wrapper;

    const initialState =  {rotate : {rotating: true}};
    beforeEach(() => {
        store = buildStore(initialState);
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

    it('Should pass actions updated values ', () => {
        expect(wrapper.find('button.rotate-button').first().text()).toEqual("STOP ROTATE");
        expect(wrapper.find('img').first().hasClass('App-logo')).toEqual(true);
        expect(store.getActions().length).toBe(0);
        const button = wrapper.find('button.rotate-button');
        button.simulate('click');
        expect(store.getActions().length).toBe(1);
        expect(store.getActions()[0]).toEqual(
            {
                "type": "rotate",
                "payload": false
            });
    });
});