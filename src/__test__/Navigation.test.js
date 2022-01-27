import React from 'react';
import { mount } from 'enzyme';
import Navigation from '../components/Navigation';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

const mockStore = configureStore([thunk]);

describe('<Navigation />', () => {

    let store;
    let wrapper;

    const initialState =  {
        rr: {route: 'inbox' },
        er: { inboxVideos: []}
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <Router>
                <Navigation />
            </Router>
        </Provider>);
    });
});
