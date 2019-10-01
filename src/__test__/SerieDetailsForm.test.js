import React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import getAction from './utils/getAction';
import SeriesReducer from '../reducers/seriesReducer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SeriesUploadForm from '../components/SeriesUploadForm';
import { addMoodleNumberCall, apiFailureCall, removeMoodleNumber, removeMoodleNumberCall } from '../actions/seriesAction';

const mockStore = configureStore([thunk]);

const series =  [
    { 'identifier': '13d1505c-0afb-456b-b5f8-46666b7640a9', 'title': 'lataamo-testisarja-1.', 'creator': 'lataamo-testi', contributors: ['baabe'] },
    { 'identifier': '13d1505c-0afb-456b-b5f8-46666b764032', 'title': 'lataamo-testisarja-2.', 'creator': 'lataamo-testi', contributors: ['baabe'] }
];

const moodleNumber1 = 123;
const moodleNumber2 = 234;
const moodleNumber3 = 345;

const translations = { en: { serie_id: 'identifier', lataamo: 'Loader', videos: 'Videos', search: 'Search', series_title: 'Series title', serie_contributors: 'Contributors' }, fi: { serie_id: 'sarjan id', lataamo: 'Lataamo', search: 'Etsi', serie_title: 'Sarjan nimi', serie_contributors: 'kontribuuttori' }, sv: { serie_id: 'serie id', lataamo: 'Loader', search: 'Söka', serie_title: 'serie titeln' , serie_contributors: 'kontribuuttor' } };

const msg = 'Unable to fetch data';

describe('<SerieList />', () => {
    const initialState =  {
        ser: { error: '', series: series, loading: false },
        sr: { apiError: '' },
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
                <SeriesUploadForm />
            </Router>
        </Provider>);
    });

    it('Should render the component with mock store', () => {
        expect(wrapper).not.toBe(null);
        expect(wrapper.contains(<SeriesUploadForm/>)).toEqual(true);
    });

    it('initially should not fire any action', async () => {
        expect(store.getActions().length).toBe(0);
    });

    it('when user adds new moodle course fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addMoodleNumberCall(moodleNumber1));
        expect(await getAction(store, 'ADD_MOODLE_NUMBER')).not.toBe(null);
        expect(await getAction(store, 'ADD_MOODLE_NUMBER')).toEqual({
            'type': 'ADD_MOODLE_NUMBER',
            'payload': moodleNumber1
        });
        const expectedState =   { 'moodleNumbers': [moodleNumber1], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [], 'iamGroups': [] };
        expect(SeriesReducer(undefined, await getAction(store, 'ADD_MOODLE_NUMBER'))).toEqual(expectedState);
    });

    it('when user adds multiple moodle courses fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addMoodleNumberCall(moodleNumber2));
        const initialState =   { 'moodleNumbers': [moodleNumber1], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [] };
        const expectedState =   { 'moodleNumbers': [moodleNumber1, moodleNumber2], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [] };
        expect(SeriesReducer(initialState, await getAction(store, 'ADD_MOODLE_NUMBER'))).toEqual(expectedState);
    });

    it('when user removes new moodle course fire action', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(removeMoodleNumberCall(moodleNumber1));
        expect(await getAction(store, 'REMOVE_MOODLE_NUMBER')).not.toBe(null);
        expect(await getAction(store, 'REMOVE_MOODLE_NUMBER')).toEqual({
            'type': 'REMOVE_MOODLE_NUMBER',
            'payload': moodleNumber1
        });
    });

    it('when user removes moodle courses fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(removeMoodleNumber(moodleNumber2));
        const initialState =   { 'moodleNumbers': [moodleNumber1, moodleNumber2, moodleNumber3], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [], 'iamGroups': [] };
        const expectedState =   { 'moodleNumbers': [moodleNumber1, moodleNumber3], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [] };
        expect(SeriesReducer(initialState, await getAction(store, 'REMOVE_MOODLE_NUMBER'))).toEqual(expectedState);
    });

    it('Should return error values ', async() => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(apiFailureCall(msg));
        expect(await getAction(store, 'FAILURE_API_CALL')).not.toBe(null);
        expect(await getAction(store, 'FAILURE_API_CALL')).toEqual({
            'loading': false,
            'type': 'FAILURE_API_CALL',
            'payload': msg
        });
    });

});

