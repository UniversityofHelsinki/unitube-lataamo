import React from 'react';
import { mount } from 'enzyme';
import IamGroupList from '../components/IamGroupList';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const mockStore = configureStore([thunk]);

describe('<IamGroupList />', () => {

    let store;
    let wrapper;

    const initialState =  {
        ser: { persons: [],
            iamGroups: [] }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <IamGroupList />
        </Provider>);
    });
});
