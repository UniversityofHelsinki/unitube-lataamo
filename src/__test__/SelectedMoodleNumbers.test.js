import React from 'react';
import { shallow } from 'enzyme';
import SelectedMoodleNumbers from '../components/SelectedMoodleNumbers';

it('renders without crashing', () => {
    shallow(<SelectedMoodleNumbers />);
});