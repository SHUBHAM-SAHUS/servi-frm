import {
    ORGANIZATION_GET_ORGANIZATION, SA_GET_SERVICEAGENT, SA_GET_OTHER_SERVICEAGENT
} from '../dataProvider/constant';
import OrganizationReducer from '../reducers/organizationReducer';

describe('Test Organization Reducer', () => {

    const DEFAULT_STATE = {
        organizations: [],
        serviceAgents: [],
        otherServiceAgents: []
    }

    it('Should return default state', () => {
        const newState = OrganizationReducer(undefined, {});
        expect(newState).toEqual(DEFAULT_STATE);
    });

    it('Should return new state on receiving type Organization list', () => {
        const payload = [{name: "TestOrganization"}];
        const orgState = { ...DEFAULT_STATE, organizations: payload };
        const newState = OrganizationReducer(undefined, {
            type: ORGANIZATION_GET_ORGANIZATION,
            payload: payload
        });
        expect(newState).toEqual(orgState);

    });
    it('Should return new state on receiving other ServiceAgents list', () => {
        const payload = [{name: "TestOrganization"}];
        const orgState = { ...DEFAULT_STATE, serviceAgents: payload };
        const newState = OrganizationReducer(undefined, {
            type: SA_GET_SERVICEAGENT,
            payload: payload
        });
        expect(newState).toEqual(orgState);

    });
    it('Should return new state on receiving type Service agent list', () => {
        const payload = [{name: "TestOrganization"}];
        const orgState = { ...DEFAULT_STATE, otherServiceAgents: payload };
        const newState = OrganizationReducer(undefined, {
            type: SA_GET_OTHER_SERVICEAGENT,
            payload: payload
        });
        expect(newState).toEqual(orgState);

    });
});