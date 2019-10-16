import React from 'react';
import { shallow } from 'enzyme';
import IamGroupList from '../components/IamGroupList';

it('renders without crashing', () => {
    shallow(<IamGroupList />);
});