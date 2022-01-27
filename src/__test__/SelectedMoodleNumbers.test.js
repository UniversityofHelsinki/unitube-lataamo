import React from 'react';
import { mount } from 'enzyme';
import SelectedMoodleNumbers from '../components/SelectedMoodleNumbers';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);

describe('<SelectedMoodleNumbers />', () => {

    let store;
    let wrapper;

    const initialState =  {
        ser: { moodleNumbers: [] }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <SelectedMoodleNumbers />
        </Provider>);
    });
});
