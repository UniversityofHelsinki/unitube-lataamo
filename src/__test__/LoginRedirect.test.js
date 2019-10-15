import React from 'react';
import { shallow } from 'enzyme';
import LoginRedirect from '../components/LoginRedirect';

it('renders without crashing', () => {
    shallow(<LoginRedirect />);
});