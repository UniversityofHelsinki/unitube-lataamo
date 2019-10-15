import React from 'react';
import { shallow } from 'enzyme';
import Footer from '../components/Footer';

it('renders without crashing', () => {
    shallow(<Footer />);
});