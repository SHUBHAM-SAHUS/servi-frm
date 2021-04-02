import { STOP_SPINNER, START_SPINNER, STOP_MINI_SPINNER, START_MINI_SPINNER, STOP_SCROLL_SPINNER, START_SCROLL_SPINNER } from '../dataProvider/constant'

export const stopSipnner = (dispatch) => {
  dispatch({
    type: STOP_SPINNER
  });
}

export const startSipnner = (dispatch) => {
  dispatch({
    type: START_SPINNER
  });
}

export const stopMiniSpinner = dispatch => {
  dispatch({
    type: STOP_MINI_SPINNER
  });
}

export const startMiniSpinner = (dispatch) => {
  dispatch({
    type: START_MINI_SPINNER
  });
}

export const startScrollSpinner = dispatch => {
  dispatch({
    type: START_SCROLL_SPINNER
  })
}
export const stopScrollSpinner = dispatch => {
  dispatch({
    type: STOP_SCROLL_SPINNER
  })
}