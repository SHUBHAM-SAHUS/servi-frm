import {
  AUTH_ERROR,
  AUTH_SIGN_UP,
  AUTH_SIGN_IN,
  AUTH_SIGN_OUT,
  START_SPINNER,
  STOP_SPINNER,
  AUTH_FORGOT_PASS,
  AUTH_RESET,
  AUTH_FORGOT_USER,
  AUTH_CLEAN_STORE,
  CLEAR_ERROR,
  STOP_MINI_SPINNER,
  START_MINI_SPINNER,
  STOP_SCROLL_SPINNER,
  START_SCROLL_SPINNER
} from '../dataProvider/constant';

const DEFAULT_STATE = {
  errorMessage: '',
  showSpinner: 0,
  showMiniSpinner: false,
  showScrollSpinner: false,
  loginStatus: 0,
  authType: '',
  secondStepStatus: 0,
  forgotPassStatus: 0,
  resetStatus: 0,
  forgetUserType: undefined,
  forgetUserStatus: 0
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {

    case AUTH_SIGN_UP:
      return {
        ...state,
        errorMessage: '',
        secondStepStatus: action.secondStepStatus,
        authType: action.authType
      }

    case AUTH_SIGN_IN:
      return {
        ...state,
        errorMessage: '',
        loginStatus: action.loginStatus,
        authType: action.authType
      }

    case AUTH_ERROR:
      return {
        ...state, errorMessage: action.payload,
        loginStatus: action.loginStatus ? action.loginStatus : state.loginStatus,
        secondStepStatus: action.secondStepStatus ? action.secondStepStatus : state.secondStepStatus,
        forgotPassStatus: action.forgotPassStatus ? action.forgotPassStatus : state.forgotPassStatus,
        resetStatus: action.resetStatus ? action.resetStatus : state.resetStatus
      }

    case AUTH_SIGN_OUT:
      return {
        ...state,
        loginStatus: 0,
        secondStepStatus: 0,
        errorMessage: ''
      }

    case START_SPINNER:
      return {
        ...state,
        showSpinner: state.showSpinner + 1
      }

    case STOP_SPINNER:
      return {
        ...state,
        showSpinner: state.showSpinner - 1
      }

    case STOP_MINI_SPINNER:
      return {
        ...state,
        showMiniSpinner: false
      }
    case START_MINI_SPINNER:
      return {
        ...state,
        showMiniSpinner: true
      }

    case STOP_SCROLL_SPINNER:
      return {
        ...state,
        showScrollSpinner: false
      }
    case START_SCROLL_SPINNER:
      return {
        ...state,
        showScrollSpinner: true
      }

    case AUTH_FORGOT_PASS:
      return {
        ...state,
        forgotPassStatus: action.forgotPassStatus
      }

    case AUTH_RESET:
      return {
        ...state,
        resetStatus: action.resetStatus
      }

    case AUTH_FORGOT_USER:
      return {
        ...state,
        forgetUserStatus: action.forgetUserStatus,
        forgetUserType: action.forgetUserType
      }

    case AUTH_CLEAN_STORE:
      return {
        ...state,
        ...DEFAULT_STATE
      }

    case CLEAR_ERROR:
      return {
        ...state,
        errorMessage: ''
      }

    default:
      return state;
  }
}