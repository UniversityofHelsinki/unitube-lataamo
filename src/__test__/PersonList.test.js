import React from 'react';
import { shallow } from 'enzyme';
import PersonList from '../components/PersonList';

it('renders without crashing', () => {
    shallow(<PersonList />);
});