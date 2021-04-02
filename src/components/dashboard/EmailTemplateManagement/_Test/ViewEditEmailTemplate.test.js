import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewEditEMailTemplate from '../ViewEditEMailTemplate';

describe('ViewEditEMailTemplate Component Test', () => {

  const initialState = {
    emailTemplate: {
      emailTemplateDetails: {}
    }
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<ViewEditEMailTemplate store={store} />)
  })

  it('should render component ViewEditEMailTemplate correctly', () => {
    const component = shallow(<ViewEditEMailTemplate store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) ViewEditEMailTemplate component', () => {
    expect(container.length).toEqual(1)
  });
})