import React from "react";
import {mount} from "enzyme/build";
import {Provider} from "react-redux";
import {apiFailureCall, apiGetVideosSuccessCall} from "../actions/videosAction";
import getAction from './utils/getAction';
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import VideoList from "../components/VideoList";

const mockStore = configureStore([thunk]);

const videos =  [
    { "identifier": "13d1505c-0afb-456b-b5f8-46666b7640a9", "title": "Vierailuluento: Avaruudesta avaruustieteitä.", "duration": 0, "creator": "xyz_kuvaaja" },
    { "identifier": "e4ff3ffe-e32a-42f2-8967-20b44cdc20e1", "title": "Mansikoiden lisääntyminen umpimetsässä.", "duration": 33000, "creator": "xyz_kuvaaja" },
    { "identifier": "4a6dc481-be36-4d3a-a813-bf415374b83d", "title": "Voittokulku ja kuinka se taklataan. Projektioita projektimaailmasta.", "duration": 0, "creator": "xyz_kuvaaja" },
    { "identifier": "eb68f711-04f9-4b58-b6c8-582a77d7b8a5", "title": "Autonomisen yhteiskunnan mahdollisuudet ja uhat maapallolla.", "duration": 0, "creator": "xzz_kuvaaja" },
    { "identifier": "e269af0d-3c68-457d-90b5-08da5b531152", "title": "Atomien välisten yhteyksien hahmottaminen Cernin ulkopuolella.", "duration   ": 25000, "creator": "xyx_kuvaaja" }
]

const msg = "Unable to fetch data";

describe('<VideoList />', () => {

    const initialState =  {
        vr: {error: "", videos: videos}
    }

    let store;
    let wrapper;

    beforeEach(() => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <VideoList />
        </Provider>);
    });

    it('Should pass actions updated values ', async() => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(apiGetVideosSuccessCall(videos));
        expect(await getAction(store, "SUCCESS_API_GET_VIDEOS")).not.toBe(null);
        expect(await getAction(store, "SUCCESS_API_GET_VIDEOS")).toEqual({
            "type": "SUCCESS_API_GET_VIDEOS",
            "payload": videos
        });
    });

    it('Should return error values ', async() => {
        expect(store.getActions().length).toBe(0);
        store.dispatch(apiFailureCall(msg));
        expect(await getAction(store, "FAILURE_API_CALL")).not.toBe(null);
        expect(await getAction(store, "FAILURE_API_CALL")).toEqual({
            "type": "FAILURE_API_CALL",
            "msg": msg
        });
    });

});