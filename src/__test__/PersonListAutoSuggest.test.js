import React from 'react';
import { shallow } from 'enzyme';
import PersonListAutoSuggest from '../components/PersonListAutoSuggest';

it('renders without crashing', () => {
    shallow(<PersonListAutoSuggest />);
});