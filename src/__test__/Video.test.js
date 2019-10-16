import React from 'react';
import { shallow } from 'enzyme';
import Video from '../components/Video';

it('renders without crashing', () => {
    shallow(<Video />);
});