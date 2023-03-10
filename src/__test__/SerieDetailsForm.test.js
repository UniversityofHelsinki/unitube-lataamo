import React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import getAction from './utils/getAction';
import SeriesReducer from '../reducers/seriesReducer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SerieDetailsForm from '../components/SerieDetailsForm';
import {
    addIamGroup,
    addMoodleNumberCall, addPerson,
    apiFailureCall, removeIamGroup,
    removeMoodleNumberCall, removePerson
} from '../actions/seriesAction';

const mockStore = configureStore([thunk]);

const series =  [
    { 'identifier': '13d1505c-0afb-456b-b5f8-46666b7640a9', 'title': 'lataamo-testisarja-1.', 'creator': 'lataamo-testi', contributors: ['baabe'] },
    { 'identifier': '13d1505c-0afb-456b-b5f8-46666b764032', 'title': 'lataamo-testisarja-2.', 'creator': 'lataamo-testi', contributors: ['baabe'] }
];

const moodleNumber1 = 123;
const moodleNumber2 = 234;
const moodleNumber3 = 345;

const iamGroup1 = 'grp-a02700-test-1';
const iamGroup2 = 'grp-a02700-test-2';
const iamGroup3 = 'grp-a02700-test-3';

const person1 = 'ekvekara';
const person2 = 'balenov';
const person3 = 'baepe';

const translations = { en: { serie_id: 'identifier', lataamo: 'Loader', videos: 'Videos', search: 'Search', series_title: 'Series title', serie_contributors: 'Contributors' }, fi: { serie_id: 'sarjan id', lataamo: 'Lataamo', search: 'Etsi', serie_title: 'Sarjan nimi', serie_contributors: 'kontribuuttori' }, sv: { serie_id: 'serie id', lataamo: 'Loader', search: 'Söka', serie_title: 'serie titeln' , serie_contributors: 'kontribuuttor' } };

const msg = 'Unable to fetch data';

describe('<SerieList />', () => {
    const initialState =  {
        ser: { error: '', series: series, seriesDropDown: [],  serie: {
            title : '',
            description: '',
            published: '',
        }, loading: false, moodleNumbers: [], iamGroups: [], persons: [] },
        sr: { apiError: '' },
        ur : { user: { eppn: '', preferredLanguage: '' } },
        i18n : {
            translations: translations,
            locale: 'fi'
        },
        gf: { globalFeedback: 'global feedback' }
    };
    let store;
    let wrapper;

    beforeEach(() => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <Router>
                <SerieDetailsForm />
            </Router>
        </Provider>);
    });

    it('Should render the component with mock store', () => {
        expect(wrapper).not.toBe(null);
        expect(wrapper.contains(<SerieDetailsForm/>)).toEqual(true);
    });

    it('initially should not fire any action', async () => {
        expect(store.getActions().length).toBe(0);
    });

    it('user adds new moodle course fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addMoodleNumberCall(moodleNumber1));
        expect(await getAction(store, 'ADD_MOODLE_NUMBER')).not.toBe(null);
        expect(await getAction(store, 'ADD_MOODLE_NUMBER')).toEqual({
            'type': 'ADD_MOODLE_NUMBER',
            'payload': moodleNumber1
        });
        const expectedState =   {
            'moodleNumbers': [moodleNumber1],
            'selectedRowId': '',
            "seriesDropDown": [],
            'serie': {
                'description': '',
                'moodleNumber': '',
                'moodleNumbers': [],
                'title': '',
                'published': '' },
            'series': [],
            'iamGroups': [],
            'persons': [],
            seriesPostSuccessMessage: null,
            seriesPostFailureMessage: null };
        //const value = SeriesReducer(undefined, await getAction(store, 'ADD_MOODLE_NUMBER'));
        expect(SeriesReducer(undefined, await getAction(store, 'ADD_MOODLE_NUMBER'))).toEqual(expectedState);
    });


    it('user adds multiple moodle courses fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addMoodleNumberCall(moodleNumber2));
        const initialState =   { 'moodleNumbers': [moodleNumber1], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [], 'persons': [] };
        const expectedState =   { 'moodleNumbers': [moodleNumber1, moodleNumber2], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [], 'persons':[]  };
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

    it('user removes moodle courses fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(removeMoodleNumberCall(moodleNumber2));
        const initialState =   { 'moodleNumbers': [moodleNumber1, moodleNumber2, moodleNumber3], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [], 'iamGroups': [], 'persons': [] };
        const expectedState =   { 'moodleNumbers': [moodleNumber1, moodleNumber3], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [], 'persons': [] };
        expect(SeriesReducer(initialState, await getAction(store, 'REMOVE_MOODLE_NUMBER'))).toEqual(expectedState);
    });

    it('user adds new iam group fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addIamGroup(iamGroup1));
        expect(await getAction(store, 'ADD_IAM_GROUP')).not.toBe(null);
        expect(await getAction(store, 'ADD_IAM_GROUP')).toEqual({
            'type': 'ADD_IAM_GROUP',
            'payload': iamGroup1
        });
        const expectedState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '',  'published': '', 'moodleNumber': '', 'moodleNumbers': [] },'series': [], 'seriesDropDown': [], 'iamGroups': [iamGroup1], 'persons': [],
            seriesPostSuccessMessage: null,
            seriesPostFailureMessage: null };
        expect(SeriesReducer(undefined, await getAction(store, 'ADD_IAM_GROUP'))).toEqual(expectedState);
    });

    it('user adds multiple iam groups fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addIamGroup(iamGroup2));
        expect(await getAction(store, 'ADD_IAM_GROUP')).not.toBe(null);
        expect(await getAction(store, 'ADD_IAM_GROUP')).toEqual({
            'type': 'ADD_IAM_GROUP',
            'payload': iamGroup2
        });
        const initialState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [iamGroup1], 'persons': [] };
        const expectedState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [iamGroup1, iamGroup2], 'persons': [] };
        expect(SeriesReducer(initialState, await getAction(store, 'ADD_IAM_GROUP'))).toEqual(expectedState);
    });

    it('user removes iam group fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(removeIamGroup(iamGroup2));
        expect(await getAction(store, 'REMOVE_IAM_GROUP')).not.toBe(null);
        expect(await getAction(store, 'REMOVE_IAM_GROUP')).toEqual({
            'type': 'REMOVE_IAM_GROUP',
            'payload': iamGroup2
        });
        const initialState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [], 'iamGroups': [iamGroup1, iamGroup2, iamGroup3], 'persons':[]  };
        const expectedState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [iamGroup1, iamGroup3], 'persons':[]  };
        expect(SeriesReducer(initialState, await getAction(store, 'REMOVE_IAM_GROUP'))).toEqual(expectedState);
    });

    it('user adds new person fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addPerson(person1));
        expect(await getAction(store, 'ADD_PERSON')).not.toBe(null);
        expect(await getAction(store, 'ADD_PERSON')).toEqual({
            'type': 'ADD_PERSON',
            'payload': person1
        });
        const expectedState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '',  'published': '', 'moodleNumber': '', 'moodleNumbers': [] },'series': [], 'seriesDropDown': [], 'iamGroups': [], 'persons': [person1],
            seriesPostSuccessMessage: null,
            seriesPostFailureMessage: null };
        expect(SeriesReducer(undefined, await getAction(store, 'ADD_PERSON'))).toEqual(expectedState);
    });

    it('user adds multiple new persons fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addPerson(person2));
        expect(await getAction(store, 'ADD_PERSON')).not.toBe(null);
        expect(await getAction(store, 'ADD_PERSON')).toEqual({
            'type': 'ADD_PERSON',
            'payload': person2
        });
        const initialState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '',  'published': '' },'series': [], 'iamGroups': [], 'persons': [person1],
            seriesPostSuccessMessage: null,
            seriesPostFailureMessage: null };
        const expectedState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '',  'published': '' },'series': [], 'iamGroups': [], 'persons': [person1, person2],
            seriesPostSuccessMessage: null,
            seriesPostFailureMessage: null };
        expect(SeriesReducer(initialState, await getAction(store, 'ADD_PERSON'))).toEqual(expectedState);
    });

    it('user removes person fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(removePerson(person1));
        expect(await getAction(store, 'REMOVE_PERSON')).not.toBe(null);
        expect(await getAction(store, 'REMOVE_PERSON')).toEqual({
            'type': 'REMOVE_PERSON',
            'payload': person1
        });
        const initialState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [], 'iamGroups': [], 'persons':[person1, person2, person3]  };
        const expectedState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '' },'series': [],'iamGroups': [], 'persons':[person2, person3]  };
        expect(SeriesReducer(initialState, await getAction(store, 'REMOVE_PERSON'))).toEqual(expectedState);
    });


    it('user tries to add same person twice fire action and return correct state', async () => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(addPerson(person1));
        expect(await getAction(store, 'ADD_PERSON')).not.toBe(null);
        expect(await getAction(store, 'ADD_PERSON')).toEqual({
            'type': 'ADD_PERSON',
            'payload': person1
        });
        const initialState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '',  'published': '' },'series': [], 'iamGroups': [], 'persons': [person1],
            seriesPostSuccessMessage: null,
            seriesPostFailureMessage: null };
        const expectedState =   { 'moodleNumbers': [], 'selectedRowId': '', 'serie': { 'description': '', 'title': '',  'published': '' },'series': [], 'iamGroups': [], 'persons': [person1],
            seriesPostSuccessMessage: null,
            seriesPostFailureMessage: null };
        expect(SeriesReducer(initialState, await getAction(store, 'ADD_PERSON'))).toEqual(expectedState);
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

