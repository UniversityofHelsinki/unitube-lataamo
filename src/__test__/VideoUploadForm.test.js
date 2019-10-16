import React from 'react';
import { shallow } from 'enzyme';
import VideoUploadForm from '../components/VideoUploadForm';

it('renders without crashing', () => {
    shallow(<VideoUploadForm />);
});