import React from 'react';
import { mount } from 'enzyme';
import User from '../components/User';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const mockStore = configureStore([thunk]);

describe('<User />', () => {

    let store;
    let wrapper;

    const initialState =  {
        ur : { user: { eppn: '', preferredLanguage: '' } }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <User />
        </Provider>);
    });
});
