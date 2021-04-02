import moxios from 'moxios';
import { testStore } from '../utils/testUtils';
import * as actions from '../actions';
import {
    MFA_STA,
    JWT_SESSION_TOKEN,
    USER_NAME
} from '../dataProvider/constant';

describe('signIn Actions', () => {

    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    test('MFA Response', () => {

        const expectedState = {
            errorMessage: '',
            showSpinner: false,
            loginStatus: 1,
            authType: MFA_STA,
            secondStepStatus: 0
        }
        const store = testStore();
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {
                    status: 1,
                    data: {
                        type: MFA_STA,
                        auth_data: { session_token: "testToken" }
                    }
                }
            })
        });
        
        return store.dispatch(actions.signIn({ user_name: "testUser" }))
            .then(() => {
                const newState = store.getState();
                expect(newState.auth).toMatchObject(expectedState);
                expect(getStorage(JWT_SESSION_TOKEN)).toBe("testToken");
                expect(getStorage(USER_NAME)).toBe("testUser")
            })

    });

});