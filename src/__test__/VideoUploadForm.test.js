import React from 'react';
import { mount } from 'enzyme';
import VideoUploadForm from '../components/VideoUploadForm';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
const translations = { en: { hy_address_part1: 'Address'}, fi: { hy_address_part1: 'Osoite'}, sv: { hy_address_part1: 'Adressen'} };

describe('<VideoUploadForm />', () => {
    let store;
    let wrapper;

    const initialState =  {
        er: {
            event: {
                title : '',
                description: ''
            },
            inboxVideos : [],
            licenses : ["UNITUBE-ALLRIGHTS","CC-BY","CC-BY-NC-ND","CC0"]
            },
        ser: { series: []},
        fur: {
            timeRemaining: 0,
            percentage: 0
        },
        ur : { user: { eppn: '', preferredLanguage: '' } },
        i18n : {
            translations: translations,
            locale: 'fi'
        }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <VideoUploadForm />
        </Provider>);
    });
});
