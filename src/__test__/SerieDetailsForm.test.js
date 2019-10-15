import React from 'react';
import { shallow } from 'enzyme';
import SerieDetailsForm from '../components/SerieDetailsForm';

it('renders without crashing', () => {
    shallow(<SerieDetailsForm />);
});