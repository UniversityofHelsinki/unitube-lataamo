import React from 'react';
import { mount } from 'enzyme';
import LoginRedirect from '../components/LoginRedirect';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const mockStore = configureStore([thunk]);

describe('<LoginRedirect />', () => {

    let store;
    let wrapper;

    const initialState =  {
        sr: { apiError: '', redirect401: null },
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <LoginRedirect loginUrl='' />
        </Provider>);
    });
});
