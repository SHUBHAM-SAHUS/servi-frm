import {SignInComponent} from '../signin';
import { shallow } from 'enzyme';
import { findByClassName, testStore } from '../../../utils/testUtils';
import React from 'react';

const store = testStore();
let handleSubmit = jest.fn();
const setUp = () => {
    const wrapper = shallow(<SignInComponent store={store} handleSubmit={handleSubmit}/>).childAt(0).dive();
    return wrapper;
};

describe('SignIn Component', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });

    it('Should render without errors', () => {
        const component = findByClassName(wrapper, 'sf-login');
        expect(component.length).toBe(1);
    });

    it('should render correctly in SignInComponent', () => {
        const component = shallow(<SignInComponent store={store} />);
      
        expect(component).toMatchSnapshot();
      });
});