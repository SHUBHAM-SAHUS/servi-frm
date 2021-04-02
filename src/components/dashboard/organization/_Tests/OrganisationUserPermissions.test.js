import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import OrganisationUserPermissions from '../OrganisationUserPermissions';

describe('ServiceAgent OrganisationUserPermissions Component Test', () => {
    const initialState = {
        permissionByRoleManagement: {
            permissionByAllRole: {},
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<OrganisationUserPermissions store={store} />)
    })

    it('should render component OrganisationUserPermissions correctly', () => {
        const component = shallow(<OrganisationUserPermissions store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) OrganisationUserPermissions component', () => {
        expect(container.length).toEqual(1)
    });
})

