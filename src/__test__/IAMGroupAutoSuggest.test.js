import React from 'react';
import { mount } from 'enzyme';
import IAMGroupAutoSuggest from '../components/IAMGroupAutoSuggest';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const mockStore = configureStore([thunk]);
const translations = { en: { hy_address_part1: 'Address'}, fi: { hy_address_part1: 'Osoite'}, sv: { hy_address_part1: 'Adressen'} };

describe('<IAMGroupAutoSuggest />', () => {

    let store;
    let wrapper;

    const initialState =  {
        ser: { iamGroups: [] },
        i18n : {
            translations: translations,
            locale: 'fi'
        }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <IAMGroupAutoSuggest />
        </Provider>);
    });
});
