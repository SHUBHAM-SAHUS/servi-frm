import {
  CLIENTS_GET_CLIENTS_LIST,
  CLIENTS_ADD_CLIENT,
  GET_CLIENT_DETAILS,
  CLIENTS_GET_SITES_LIST,
  INIT_CLIENT_LIST,
  GET_CLIENT_LIST_BY_EXPAND,
  GET_CLIENT_LIST_BY_SEARCH,
  ROLE_GET_ROLES
} from "../dataProvider/constant";

const INITIAL_STATE = {
  currentPageNumber: 1,
  clients: [],
  clientDetails: [],
  sitesList: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_CLIENT_LIST:
      state.clients = []
      return {
        ...state,
        clients: action.payload,
        currentPageNumber: 1
      }
    case GET_CLIENT_LIST_BY_EXPAND:
      const clients = [...state.clients, ...action.payload]
      const updatedList = clients.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
      });
      return {
        ...state,
        clients: updatedList,
        currentPageNumber: state.currentPageNumber + 1,
      }
    case GET_CLIENT_LIST_BY_SEARCH:
      return {
        ...state,
        clients: action.payload,
        currentPageNumber: 1
      }
    case CLIENTS_GET_CLIENTS_LIST:
      return {
        ...state,
        clients: action.payload
      }
    case CLIENTS_ADD_CLIENT:
      return {
        ...state,
        clients: action.payload
      }
    case GET_CLIENT_DETAILS:
      return {
        ...state,
        clientDetails: action.payload
      }
    case CLIENTS_GET_SITES_LIST:
      return {
        ...state,
        sitesList: action.payload
      }
    case ROLE_GET_ROLES:
      return { ...state, roles: action.payload };
    default:
      return {
        ...state
      }
  }
}