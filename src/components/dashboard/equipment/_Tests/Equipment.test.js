import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Equipment from '../Equipment';

describe('Equipment Component Test', () => {

  const initialState = {
    equipmentManagement: {
      equipmentDetails: {
        equipmentList: []
      }
    },
    form: {
      AddNewEquipment: {},
      EditEquipment: {
        values: {}
      },
    },
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<Equipment store={store} />)
  })

  it('should render component Equipment correctly', () => {
    const component = shallow(<Equipment store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) Equipment component', () => {
    expect(container.length).toEqual(1)
  });
})