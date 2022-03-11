import React from 'react';
import { mount } from 'enzyme';
import VideoDetailsForm from '../components/VideoDetailsForm';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
const translations = { en: { hy_address_part1: 'Address'}, fi: { hy_address_part1: 'Osoite'}, sv: { hy_address_part1: 'Adressen'} };

describe('<VideoDetailsForm />', () => {

    let store;
    let wrapper;

    const initialState =  {
        vr: {
            videoFiles: [],
            selectedRowId: ''
        },
        er: {    videos: [],
            inboxVideos: [],
            trashVideos: [],
            event: {
            title : 'Video',
            description: 'Video video'
        }},
        ser: { seriesDropDown: []},
        i18n : {
            translations: translations,
            locale: 'fi'
        },
        ur : { user: { eppn: '', preferredLanguage: '' } }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <VideoDetailsForm />
        </Provider>);
    });
});
