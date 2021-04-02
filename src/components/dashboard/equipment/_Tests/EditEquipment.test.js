import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import EditEquipment from '../EditEquipment';

describe('EditEquipment Component Test', () => {

  const initialState = {
    equipmentManagement: {
      equipmentDetails: {},
      equipmentsList: [],
    },
    form: {
      EditEquipment: {
        values: {}
      }
    },
    industryManagement: {
      services: []
    }
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<EditEquipment store={store} />)
  })

  it('should render component EditEquipment correctly', () => {
    const component = shallow(<EditEquipment store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) EditEquipment component', () => {
    expect(container.length).toEqual(1)
  });
})