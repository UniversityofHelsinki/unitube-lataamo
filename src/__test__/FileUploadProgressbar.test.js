import React from 'react';
import { shallow } from 'enzyme';
import FileUploadProgressbar from '../components/FileUploadProgressbar';

it('renders without crashing', () => {
    shallow(<FileUploadProgressbar />);
});