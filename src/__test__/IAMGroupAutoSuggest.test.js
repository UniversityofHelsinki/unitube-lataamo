import React from 'react';
import { shallow } from 'enzyme';
import IAMGroupAutoSuggest from '../components/IAMGroupAutoSuggest';

it('renders without crashing', () => {
    shallow(<IAMGroupAutoSuggest />);
});