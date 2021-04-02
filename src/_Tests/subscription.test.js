import {
    SUBSCRIPT_GET_SUBSCRIPTS
} from '../dataProvider/constant';
import RoleReducer from '../reducers/subscriptionReducer';

describe('Test Subscription Reducer', () => {

    const DEFAULT_STATE = {
        subscriptions: [],
    }

    it('Should return default state', () => {
        const newState = RoleReducer(undefined, {});
        expect(newState).toEqual(DEFAULT_STATE);
    });

    it('Should return new state on receiving type subscription list', () => {
        const payload = [{name: "TestSubscript"}];
        const orgState = { ...DEFAULT_STATE, subscriptions: payload };
        const newState = RoleReducer(undefined, {
            type: SUBSCRIPT_GET_SUBSCRIPTS,
            payload: payload
        });
        expect(newState).toEqual(orgState);

    });
});