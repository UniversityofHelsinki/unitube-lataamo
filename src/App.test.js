import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import App from './App';
import {Provider} from "react-redux";

let store;

describe('<App />', () => {
  beforeEach(() => {
    const mockStore = configureStore();
    store = mockStore({
      rotating: true
    });
  });

  it('Should render the component with mock store', () => {
    const wrapper = shallow(<Provider store={store}>
      <App />
    </Provider>);
    expect(wrapper).not.toBe(null);
    expect(wrapper.contains(<App />)).toEqual(true);
  });
});