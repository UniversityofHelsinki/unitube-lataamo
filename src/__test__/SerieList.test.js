import React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import getAction from './utils/getAction';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SeriesList from '../components/SeriesList';
import { apiFailureCall, apiGetSeriesSuccessCall } from '../actions/seriesAction';
const mockStore = configureStore([thunk]);

const series =  [
    { 'identifier': '13d1505c-0afb-456b-b5f8-46666b7640a9', 'title': 'lataamo-testisarja-1.', 'creator': 'lataamo-testi', contributors: ['baabe'] },
    { 'identifier': '13d1505c-0afb-456b-b5f8-46666b764032', 'title': 'lataamo-testisarja-2.', 'creator': 'lataamo-testi', contributors: ['baabe'] }
];

const translations = { en: { serie_id: 'identifier', lataamo: 'Loader', videos: 'Videos', search: 'Search', series_title: 'Series title', serie_contributors: 'Contributors' }, fi: { serie_id: 'sarjan id', lataamo: 'Lataamo', search: 'Etsi', serie_title: 'Sarjan nimi', serie_contributors: 'kontribuuttori' }, sv: { serie_id: 'serie id', lataamo: 'Loader', search: 'Söka', serie_title: 'serie titeln' , serie_contributors: 'kontribuuttor' } };

const msg = 'Unable to fetch data';

describe('<SerieList />', () => {
    const initialState =  {
        ser: { error: '', series: series, loading: false },
        i18n : {
            translations: translations,
            locale: 'fi'
        }
    };
    let store;
    let wrapper;

    beforeEach(() => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <Router>
                <SeriesList />
            </Router>
        </Provider>);
    });

    it('Should render the component with mock store', () => {
        expect(wrapper).not.toBe(null);
        expect(wrapper.contains(<SeriesList/>)).toEqual(true);
    });

    it('initially should show loading bar', async () => {
        expect(store.getActions().length).toBe(1);
        expect(await getAction(store, 'GET_SERIES_REQUEST')).not.toBe(null);
        expect(await getAction(store, 'GET_SERIES_REQUEST')).toEqual({
            'loading': true,
            'type': 'GET_SERIES_REQUEST',
        });
    });

    it('Should pass actions updated values ', async() => {
        expect(store.getActions().length).toBe(1);
        expect(await getAction(store, 'GET_SERIES_REQUEST')).not.toBe(null);
        store.dispatch(apiGetSeriesSuccessCall(series));
        expect(await getAction(store, 'SUCCESS_API_GET_SERIES')).not.toBe(null);
        expect(await getAction(store, 'SUCCESS_API_GET_SERIES')).toEqual({
            'loading': false,
            'type': 'SUCCESS_API_GET_SERIES',
            'payload': series
        });
    });

    it('Should return error values ', async() => {
        expect(store.getActions().length).toBe(1);
        expect(await getAction(store, 'GET_SERIES_REQUEST')).not.toBe(null);
        store.dispatch(apiFailureCall(msg));
        expect(await getAction(store, 'FAILURE_API_CALL')).not.toBe(null);
        expect(await getAction(store, 'FAILURE_API_CALL')).toEqual({
            'loading': false,
            'type': 'FAILURE_API_CALL',
            'payload': msg
        });
    });

});