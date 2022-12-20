import React from 'react';
import { mount } from 'enzyme';
import Video from '../components/Video';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const mockStore = configureStore([thunk]);

const translations = { 
    en: { hy_address_part1: 'Address'}, 
    fi: { hy_address_part1: 'Osoite'}, 
    sv: { hy_address_part1: 'Adressen'} 
};

describe('<Video />', () => {

    let store;
    let wrapper;

    const initialState =  {
        vr: {videoFiles: [] },
        i18n : {
            translations: translations,
            locale: 'fi'
        },
        er: {    videos: [],
            inboxVideos: [],
            trashVideos: [],
            event: {
            title : 'Video',
            description: 'Video video',
            views: 5
        }}
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <Video />
        </Provider>);
    });
});
