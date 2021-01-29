import React from 'react';
import { shallow } from 'enzyme';
import FileDownloadProgressBar from '../components/FileDownloadProgressBar';

it('renders without crashing', () => {
    shallow(<FileDownloadProgressBar />);
});
