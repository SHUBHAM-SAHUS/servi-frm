import {
    AUTH_ERROR,
    AUTH_SIGN_UP,
    AUTH_SIGN_IN,
    AUTH_SIGN_OUT,
    START_SPINNER,
    STOP_SPINNER,
    MFA_STA
} from '../dataProvider/constant';
import AuthReducer from '../reducers/auth';

describe('Test Auth Reducer', () => {

    const DEFAULT_STATE = {
        errorMessage: '',
        showSpinner: false,
        loginStatus: 0,
        authType: '',
        secondStepStatus: 0,
        forgotPassStatus: 0,
        resetStatus: 0,
        forgetUserType: undefined,
        forgetUserStatus: 0
    }

    it('Should return default state', () => {
        const newState = AuthReducer(undefined, {});
        expect(newState).toEqual(DEFAULT_STATE);
    });

    it('Should return new state on receiving type AUTH_SIGN_UP', () => {
        const secondStepStatus = 1;
        const authType = MFA_STA;
        const authState = { ...DEFAULT_STATE, secondStepStatus: secondStepStatus, authType: authType };
        const newState = AuthReducer(undefined, {
            type: AUTH_SIGN_UP,
            secondStepStatus: secondStepStatus,
            authType: authType
        });
        expect(newState).toEqual(authState);

    });

    it('Should return new state on receiving type AUTH_SIGN_IN', () => {
        const loginStatus = 1;
        const authType = MFA_STA;
        const authState = { ...DEFAULT_STATE, loginStatus: loginStatus, authType: authType };
        const newState = AuthReducer(undefined, {
            type: AUTH_SIGN_IN,
            loginStatus: loginStatus,
            authType: authType
        });
        expect(newState).toEqual(authState);

    });

    it('Should return new state on receiving type AUTH_ERROR', () => {
        const loginStatus = 1;
        const errorMessage = "Test Message error";
        const authState = { ...DEFAULT_STATE, loginStatus: loginStatus, errorMessage: errorMessage };
        const newState = AuthReducer(undefined, {
            type: AUTH_ERROR,
            loginStatus: loginStatus,
            payload: errorMessage
        });
        expect(newState).toEqual(authState);

    });

    it('Should return new state on receiving type AUTH_SIGN_OUT', () => {
        const authState = { ...DEFAULT_STATE };
        const newState = AuthReducer(undefined, {
            type: AUTH_SIGN_OUT,
        });
        expect(newState).toEqual(authState);
    });

    it('Should return new state on receiving type STOP_SPINNER', () => {
        const authState = { ...DEFAULT_STATE };
        const newState = AuthReducer(undefined, {
            type: STOP_SPINNER,
        });
        expect(newState).toEqual(authState);

    });

    it('Should return new state on receiving type START_SPINNER', () => {
        const authState = { ...DEFAULT_STATE, showSpinner: true };
        const newState = AuthReducer(undefined, {
            type: START_SPINNER,
        });
        expect(newState).toEqual(authState);

    });

});