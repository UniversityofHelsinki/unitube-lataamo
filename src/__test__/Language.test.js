import React from 'react';
import { mount } from 'enzyme';
import Language from '../components/Language';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

const mockStore = configureStore([thunk]);

describe('<Language />', () => {

    let store;
    let wrapper;

    const initialState =  {
        ur : { user: { eppn: '', preferredLanguage: '' }
        }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <Router>
                <Language />
            </Router>
        </Provider>);
    });
});
