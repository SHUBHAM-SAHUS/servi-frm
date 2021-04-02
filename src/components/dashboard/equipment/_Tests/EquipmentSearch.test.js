import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import EquipmentSearch from '../EquipmentSearch';

describe('EquipmentSearch Component Test', () => {

  const initialState = {
    equipmentManagement: {
      equipmentList: []
    },
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<EquipmentSearch store={store} />)
  })

  it('should render component EquipmentSearch correctly', () => {
    const component = shallow(<EquipmentSearch store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) EquipmentSearch component', () => {
    expect(container.length).toEqual(1)
  });
})