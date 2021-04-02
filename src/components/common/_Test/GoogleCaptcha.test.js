import React from 'react';
import { shallow } from 'enzyme';

import GoogleCaptcha from '../GoogleCaptcha';
describe('GoogleCaptcha', () => {
  it('should render correctly GoogleCaptcha', () => {
    const component = shallow(<GoogleCaptcha />);
  
    expect(component).toMatchSnapshot();
  });
});