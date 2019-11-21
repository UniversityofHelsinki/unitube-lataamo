import React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { apiFailureCall } from '../actions/videosAction';
import { apiGetEventsSuccessCall } from '../actions/eventsAction';
import getAction from './utils/getAction';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import VideoList from '../components/VideoList';

const mockStore = configureStore([thunk]);

const videos = [
    {
        'identifier': '13d1505c-0afb-456b-b5f8-46666b7640a9',
        'title': 'Vierailuluento: Avaruudesta avaruustieteitä.',
        'duration': 0,
        'creator': 'xyz_kuvaaja',
        'visibility': [],
        'created': '2019-05-09T07:34:13Z',
        'series': 'sarja1',
        "media":["http://opencast:8080/assets/assets/57f48f86-446e-41dd-a08f-a1c3889a625a/e732475c-e583-4abd-a94c-75605ab7f42a/5/fruits_on_table.mp4"]
    },
    {
        'identifier': 'e4ff3ffe-e32a-42f2-8967-20b44cdc20e1',
        'title': 'Mansikoiden lisääntyminen umpimetsässä.',
        'duration': 33000,
        'creator': 'xyz_kuvaaja',
        'visibility': [],
        'created': '2019-05-09T07:34:13Z',
        'series': 'sarja2',
        "media":["http://opencast:8080/assets/assets/57f48f86-446e-41dd-a08f-a1c3889a625a/e732475c-e583-4abd-a94c-75605ab7f42a/5/fruits_on_table.mp4"]

    },
    {
        'identifier': '4a6dc481-be36-4d3a-a813-bf415374b83d',
        'title': 'Voittokulku ja kuinka se taklataan. Projektioita projektimaailmasta.',
        'duration': 0,
        'creator': 'xyz_kuvaaja',
        'visibility': [],
        'created': '2019-05-09T07:34:13Z',
        'series': 'sarja3',
        "media":["http://opencast:8080/assets/assets/57f48f86-446e-41dd-a08f-a1c3889a625a/e732475c-e583-4abd-a94c-75605ab7f42a/5/fruits_on_table.mp4"]
    },
    {
        'identifier': 'eb68f711-04f9-4b58-b6c8-582a77d7b8a5',
        'title': 'Autonomisen yhteiskunnan mahdollisuudet ja uhat maapallolla.',
        'duration': 0,
        'creator': 'xzz_kuvaaja',
        'visibility': [],
        'created': '2019-05-09T07:34:13Z',
        'series': 'sarja1',
        "media":["http://opencast:8080/assets/assets/57f48f86-446e-41dd-a08f-a1c3889a625a/e732475c-e583-4abd-a94c-75605ab7f42a/5/fruits_on_table.mp4"]
    },
    {
        'identifier': 'e269af0d-3c68-457d-90b5-08da5b531152',
        'title': 'Atomien välisten yhteyksien hahmottaminen Cernin ulkopuolella.',
        'duration   ': 25000,
        'creator': 'xyx_kuvaaja',
        'visibility': [],
        'created': '2019-05-09T07:34:13Z',
        'series': 'sarja1',
        "media":["http://opencast:8080/assets/assets/57f48f86-446e-41dd-a08f-a1c3889a625a/e732475c-e583-4abd-a94c-75605ab7f42a/5/fruits_on_table.mp4"]
    }
];

const translations = {
    en: {
        video_id: 'identifier',
        lataamo: 'Loader',
        videos: 'Videos',
        search: 'Search',
        video_title: 'Video title',
        video_duration: 'video duration',
        processing_state: 'Processing state',
        publication_status: 'Publication Status',
        created: 'Created',
        series_title: 'Series'
    },
    fi: {
        video_id: 'videon id',
        lataamo: 'Lataamo',
        videos: 'Videoni',
        search: 'Etsi',
        video_title: 'Videon nimi',
        video_duration: 'video duration',
        processing_state: 'Tallennuksen tila',
        publication_status: 'Tallenteen julkisuus',
        created: 'Luotu',
        series_title: 'Sarja'
    },
    sv: {
        video_id: 'video id',
        lataamo: 'Loader',
        videos: 'Videor',
        search: 'Söka',
        video_title: 'Video titeln',
        video_duration: 'video duration',
        processing_state: 'processing_state',
        publication_status: 'publicitet av inspelningen',
        created: 'Skapad',
        series_title: 'Serie'
    }
};

const msg = 'Unable to fetch data';

describe('<VideoList />', () => {
    const initialState = {
        er: { event: {}, videos: videos, loading: false  },
        ser: { series: [] },
        vr: { error: ''},
        sr: { apiError: ''},
        i18n: {
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
                <VideoList/>
            </Router>
        </Provider>);
    });

    it('Should render the component with mock store', () => {
        expect(wrapper).not.toBe(null);
        expect(wrapper.contains(<VideoList/>)).toEqual(true);
    });

    it('initially should show loading bar', async () => {
        expect(store.getActions().length).toBe(2);
        expect(await getAction(store, 'GET_EVENTS_REQUEST')).not.toBe(null);
        expect(await getAction(store, 'GET_EVENTS_REQUEST')).toEqual({
            'loading': true,
            'type': 'GET_EVENTS_REQUEST',
        });
    });

    it('Should pass actions updated values ', async () => {
        expect(store.getActions().length).toBe(2);
        expect(await getAction(store, 'GET_EVENTS_REQUEST')).not.toBe(null);
        store.dispatch(apiGetEventsSuccessCall(videos));
        expect(await getAction(store, 'SUCCESS_API_GET_EVENTS')).not.toBe(null);
        expect(await getAction(store, 'SUCCESS_API_GET_EVENTS')).toEqual({
            'loading': false,
            'type': 'SUCCESS_API_GET_EVENTS',
            'payload': videos
        });
    });

    it('Should return error values ', async () => {
        expect(store.getActions().length).toBe(2);
        store.dispatch(apiFailureCall(msg));
        expect(await getAction(store, 'FAILURE_API_CALL')).not.toBe(null);
        expect(await getAction(store, 'FAILURE_API_CALL')).toEqual({
            'loading': false,
            'type': 'FAILURE_API_CALL',
            'payload': msg
        });
    });

});