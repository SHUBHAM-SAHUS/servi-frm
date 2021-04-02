import {
  GET_BROADCAST, GET_BROADCAST_DETIALS, INIT_BROADCAST_LIST, GET_BROADCAST_LIST_BY_SEARCH, GET_BROADCAST_LIST_BY_EXPAND,

} from '../dataProvider/constant';

const INITIAL_STATE = {
  currentPageNumber: 1,
  broadcastList: [],
  broadcastDetails: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_BROADCAST_LIST:
      state.broadcastList = []
      return {
        ...state,
        broadcastList: action.payload,
        currentPageNumber: 1
      }
    case GET_BROADCAST_LIST_BY_SEARCH:
      return {
        ...state,
        broadcastList: action.payload,
        currentPageNumber: 1
      }
    case GET_BROADCAST_LIST_BY_EXPAND:
      const broadcastList = [...state.broadcastList, ...action.payload]
      const updatedList = broadcastList.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
      });
      return {
        ...state,
        broadcastList: updatedList,
        currentPageNumber: state.currentPageNumber + 1,
      }
    case GET_BROADCAST:
      return {
        ...state,
        broadcastList: action.payload
      }
    case GET_BROADCAST_DETIALS:
      return {
        ...state,
        broadcastDetails: action.payload
      }
    default:
      return {
        ...state
      }
  }
}