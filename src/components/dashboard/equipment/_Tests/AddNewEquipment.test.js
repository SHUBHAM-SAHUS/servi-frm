import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddNewEquipment from '../AddNewEquipment';

describe('AddNewEquipment Component Test', () => {

  const initialState = {
    industryManagement: {
      services: []
    },
    equipmentManagement: {
      equipments: []
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
    container = shallow(<AddNewEquipment store={store} />)
  })

  it('should render component AddNewEquipment correctly', () => {
    const component = shallow(<AddNewEquipment store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) AddNewEquipment component', () => {
    expect(container.length).toEqual(1)
  });
})