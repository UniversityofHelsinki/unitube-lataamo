import React from 'react';
import { shallow } from 'enzyme';
import User from '../components/User';

it('renders without crashing', () => {
    shallow(<User />);
});