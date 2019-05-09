import React from 'react';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from "redux-thunk";

import App from '../App';
import {Provider} from "react-redux";
import {apiGetVideosSuccessCall} from "../actions/apiAction";
import getAction from './utils/getAction';

const mockStore = configureStore([thunk]);


const videos =  [
        { "id": 616, "name": "Vierailuluento: Avaruudesta avaruustieteitä.", "length": 34342342, "owner": "xyz_kuvaaja" },
        { "id": 612, "name": "Mansikoiden lisääntyminen umpimetsässä.", "length": 34342342, "owner": "xyz_kuvaaja" },
        { "id": 614, "name": "Voittokulku ja kuinka se taklataan. Projektioita projektimaailmasta.", "length": 34342342, "owner": "xyz_kuvaaja" },
        { "id": 615, "name": "Autonomisen yhteiskunnan mahdollisuudet ja uhat maapallolla.", "length": 34342342, "owner": "xzz_kuvaaja" },
        { "id": 617, "name": "Atomien välisten yhteyksien hahmottaminen Cernin ulkopuolella.", "length": 34342342, "owner": "xyx_kuvaaja" }
    ]


describe('<App />', () => {

    let store;
    let wrapper;

    const initialState =  {
        //rotate : {rotating: true}, 
        api: {error: "", videos: videos}
    }

    beforeEach(() => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}>
            <App />
        </Provider>);
    });


    it('Should render the component with mock store', () => {
        expect(wrapper).not.toBe(null);
        expect(wrapper.contains(<App />)).toEqual(true);
    });


    // it('Should pass actions updated values ', async() => {
    //     expect(store.getActions().length).toBe(0);
    //     store.dispatch(apiGetVideosSuccessCall(videos));
    //     expect(await getAction(store, "api")).not.toBe(null);
    //     expect(await getAction(store, "api")).toEqual({
    //         "type": "SUCCESS_API_GET_VIDEOS",
    //         "payload": videos
    //     });
    // });
});