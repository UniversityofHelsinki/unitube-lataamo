import React from 'react';
import { shallow } from 'enzyme';
import Language from '../components/Language';

it('renders without crashing', () => {
    shallow(<Language />);
});