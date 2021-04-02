import React from 'react';
import { shallow } from 'enzyme';
import TaskFileViews from '../taskFilesView';

describe('TaskFileViews Component Test', () => {
    it('should render component TaskFileViews correctly', () => {
        const component = shallow(<TaskFileViews />);
        expect(component).toMatchSnapshot();
    });
})

