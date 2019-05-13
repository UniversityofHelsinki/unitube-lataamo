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
    { "id": 616, "name": "Vierailuluento: Avaruudesta avaruustieteitä.", "length": 34342342, "owner": "xyz_kuvaaja" },
    { "id": 612, "name": "Mansikoiden lisääntyminen umpimetsässä.", "length": 34342342, "owner": "xyz_kuvaaja" },
    { "id": 614, "name": "Voittokulku ja kuinka se taklataan. Projektioita projektimaailmasta.", "length": 34342342, "owner": "xyz_kuvaaja" },
    { "id": 615, "name": "Autonomisen yhteiskunnan mahdollisuudet ja uhat maapallolla.", "length": 34342342, "owner": "xzz_kuvaaja" },
    { "id": 617, "name": "Atomien välisten yhteyksien hahmottaminen Cernin ulkopuolella.", "length": 34342342, "owner": "xyx_kuvaaja" }
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