import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import App from '../App';
import { Provider } from 'react-redux';
const mockStore = configureStore([thunk]);

describe('<App />', () => {

    let store;
    let wrapper;

    const initialState =  {
        //rotate : {rotating: true},
        vr: { error: '', videos:[] }
    };

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

});