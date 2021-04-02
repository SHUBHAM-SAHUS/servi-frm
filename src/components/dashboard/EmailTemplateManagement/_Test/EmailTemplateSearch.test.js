import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import EmailTemplateSearch from '../EmailTemplateSearch';

describe('EmailTemplateSearch Component Test', () => {

  const initialState = {
    emailTemplate: {
      templateList: []
    }
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<EmailTemplateSearch store={store} />)
  })

  it('should render component EmailTemplateSearch correctly', () => {
    const component = shallow(<EmailTemplateSearch store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) EmailTemplateSearch component', () => {
    expect(container.length).toEqual(1)
  });
})