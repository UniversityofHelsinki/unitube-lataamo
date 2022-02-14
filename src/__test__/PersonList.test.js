import React from 'react';
import { mount } from 'enzyme';
import PersonList from '../components/PersonList';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const mockStore = configureStore([thunk]);

describe('<PersonList />', () => {

    let store;
    let wrapper;

    const initialState =  {
        ser: { persons: [],
            iamGroups: [] },
        ur : { user: { eppn: '', preferredLanguage: '' } }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <PersonList />
        </Provider>);
    });
});
