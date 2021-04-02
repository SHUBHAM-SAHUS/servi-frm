import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import EmailTemplateManagement from '../EmailTemplateManagement';

describe('EmailTemplateManagement Component Test', () => {

  const initialState = {

  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<EmailTemplateManagement store={store} />)
  })

  it('should render component EmailTemplateManagement correctly', () => {
    const component = shallow(<EmailTemplateManagement store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) EmailTemplateManagement component', () => {
    expect(container.length).toEqual(1)
  });
})