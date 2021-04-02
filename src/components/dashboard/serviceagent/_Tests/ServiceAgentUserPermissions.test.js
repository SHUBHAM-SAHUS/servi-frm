import React from 'react';
import { shallow } from 'enzyme';
import ServiceAgentUserPermissions from '../ServiceAgentUserPermissions';

describe('ServiceAgentUserPermissions Component Test', () => {

    var container
    beforeEach(() => {
        container = shallow(<ServiceAgentUserPermissions />)
    })

    it('should render component service agent user permissions correctly', () => {

        expect(container).toMatchSnapshot();
    });

    it('Render the connected(SMART) ServiceAgentUserPermissions component', () => {
        expect(container.length).toEqual(1)
    });

})

