import React from 'react';
import { mount } from 'enzyme';
import UploadButton from '../components/UploadButton';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const mockStore = configureStore([thunk]);

describe('<UploadButton />', () => {

    let store;
    let wrapper;

    const initialState =  {
        er : { inboxVideos : []}
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <UploadButton />
        </Provider>);
    });
});
