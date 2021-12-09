import React from 'react';
import { mount } from 'enzyme';
import Footer from '../components/Footer';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
const translations = { en: { hy_address_part1: 'Address'}, fi: { hy_address_part1: 'Osoite'}, sv: { hy_address_part1: 'Adressen'} };

describe('<Footer />', () => {
    let store;
    let wrapper;

    const initialState =  {
        i18n : {
            translations: translations,
            locale: 'fi'
        }
    };

    it('renders without crashing', () => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <Footer />
        </Provider>);
    });

});
