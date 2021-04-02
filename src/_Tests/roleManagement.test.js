import {
    ROLE_GET_ROLES
} from '../dataProvider/constant';
import RoleReducer from '../reducers/roleManagementReducer';

describe('Test Role Management Reducer', () => {

    const DEFAULT_STATE = {
        roles: [],
    }

    it('Should return default state', () => {
        const newState = RoleReducer(undefined, {});
        expect(newState).toEqual(DEFAULT_STATE);
    });

    it('Should return new state on receiving type Organization list', () => {
        const payload = [{name: "TestRole"}];
        const orgState = { ...DEFAULT_STATE, roles: payload };
        const newState = RoleReducer(undefined, {
            type: ROLE_GET_ROLES,
            payload: payload
        });
        expect(newState).toEqual(orgState);

    });
});