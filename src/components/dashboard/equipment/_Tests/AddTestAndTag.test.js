import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddTestAndTag from '../AddTestAndTag';

describe('AddTestAndTag Component Test', () => {

  const initialState = {
    equipmentManagement: {
      equipments: [],
      testers: [],
      resultList: []
    },
    form: {
      AddNewEquipment: {
        values: {}
      }
    },
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<AddTestAndTag store={store} />)
  })

  it('should render component AddTestAndTag correctly', () => {
    const component = shallow(<AddTestAndTag store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) AddTestAndTag component', () => {
    expect(container.length).toEqual(1)
  });
})