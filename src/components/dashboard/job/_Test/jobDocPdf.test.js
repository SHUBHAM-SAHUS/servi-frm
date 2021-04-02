import React from 'react';
import { shallow } from 'enzyme';
import JobDocPdf from '../JobDocPdf';

describe('JobDocPdf Component Test', () => {
    it('should render component JobDocPdf correctly', () => {
        const component = shallow(<JobDocPdf />);
        expect(component).toMatchSnapshot();
    });
})

