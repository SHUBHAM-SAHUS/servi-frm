import {
  EQUIPMENT_GET_TESTERS_LIST,
  EQUIPMENT_GET_SERVICES_LIST,
  EQUIPMENT_GET_EQUIPMENTS_LIST,
  EQUIPMENT_GET_EQUIPMENT_DETAILS,
  EQUIPMENT_GET_ASSOCIATED_SERVICES,
  EQUIPMENT_GET_TEST_AND_TAG_HISTORY,
  GET_TEST_TYPE_AND_TAG,
  EQUIPMENT_RESULT,
  INIT_EQUIPMENT_LIST,
  GET_EQUIPMENT_LIST_BY_EXPAND,
  GET_EQUIPMENT_LIST_BY_SEARCH,
  GET_EQUIPMENT_LIST_ADVANCE_SEARCH,
} from '../dataProvider/constant'

const INITIAL_STATE = {
  currentPageNumber: 1,
  testersList: [
    {
      id: 3,
      name: "Anurag"
    },
    {
      id: 7,
      name: "Kalpesh"
    },
  ],
  servicesList: [],
  equipmentsList: [],
  equipmentDetails: [],
  allTestType: [],
  resultList: [],
  testAndTagHistory: [
    {
      "id": 7,
      "test_date": "2019-09-04T00:00:00.000Z",
      "next_test_date": "2019-08-07T00:00:00.000Z",
      "tester_id": 7,
      "test_type": "manual",
      "equ_id": 6
    },
    {
      "id": 8,
      "test_date": "2019-09-04T00:00:00.000Z",
      "next_test_date": "2019-08-07T00:00:00.000Z",
      "tester_id": 8,
      "test_type": "manual",
      "equ_id": 16
    },
    {
      "id": 9,
      "test_date": "2019-09-18T08:51:57.000Z",
      "next_test_date": "2019-09-16T08:52:48.000Z",
      "tester_id": 9,
      "test_type": "Durability test",
      "equ_id": 29
    },
    {
      "id": 10,
      "test_date": "2019-09-16T08:57:21.000Z",
      "next_test_date": "2019-09-19T08:57:35.000Z",
      "tester_id": 10,
      "test_type": "Dolore inventore sun",
      "equ_id": 30
    },
    {
      "id": 11,
      "test_date": "2019-09-01T09:00:53.000Z",
      "next_test_date": "2019-09-30T09:01:55.000Z",
      "tester_id": 11,
      "test_type": "Driving safety",
      "equ_id": 31
    },
    {
      "id": 12,
      "test_date": "2019-09-04T00:00:00.000Z",
      "next_test_date": "2019-08-07T00:00:00.000Z",
      "tester_id": 3,
      "test_type": "manual",
      "equ_id": 32
    }
  ],
  associatedServices: [
    {
      "id": 36,
      "equ_id": 40,
      "service_id": 16,
      "deleted": null,
      "created_by": null,
      "modified_by": null,
      "created_at": "2019-09-18T10:36:15.000Z",
      "modified_at": null
    },
    {
      "id": 37,
      "equ_id": 40,
      "service_id": 17,
      "deleted": null,
      "created_by": null,
      "modified_by": null,
      "created_at": "2019-09-18T10:36:15.000Z",
      "modified_at": null
    },
    {
      "id": 38,
      "equ_id": 40,
      "service_id": 18,
      "deleted": null,
      "created_by": null,
      "modified_by": null,
      "created_at": "2019-09-18T10:36:15.000Z",
      "modified_at": null
    }
  ],
  equipmentListAdvanceSearch: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_EQUIPMENT_LIST:
      state.equipmentsList = []
      return {
        ...state,
        equipmentsList: action.payload,
        currentPageNumber: 1
      }
    case GET_EQUIPMENT_LIST_BY_SEARCH:
      return {
        ...state,
        equipmentsList: action.payload,
        currentPageNumber: 1
      }
    case GET_EQUIPMENT_LIST_BY_EXPAND:
      const equipmentsList = [...state.equipmentsList, ...action.payload]
      const updatedList = equipmentsList.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
      });
      return {
        ...state,
        equipmentsList: updatedList,
        currentPageNumber: state.currentPageNumber + 1,
      }
    case EQUIPMENT_GET_TESTERS_LIST:
      return {
        ...state,
        testersList: action.testersList
        // testersList: INITIAL_STATE.testersList
      }
    case EQUIPMENT_GET_EQUIPMENTS_LIST:
      return {
        ...state,
        equipmentsList: action.equipmentsList
      }
    case EQUIPMENT_GET_SERVICES_LIST:
      return {
        ...state,
        servicesList: action.services
      }
    case EQUIPMENT_GET_EQUIPMENT_DETAILS:
      return {
        ...state,
        equipmentDetails: action.equipmentDetails
      }
    case EQUIPMENT_GET_TEST_AND_TAG_HISTORY:
      return {
        ...state,
        // testAndTagHistory: action.testAndTag
        testAndTagHistory: INITIAL_STATE.testAndTagHistory
      }
    case EQUIPMENT_GET_ASSOCIATED_SERVICES:
      return {
        ...state,
        // associatedServices: action.associatedServices
        associatedServices: INITIAL_STATE.associatedServices
      }
    case GET_TEST_TYPE_AND_TAG:
      return {
        ...state,
        allTestType: action.payload
      }
    case EQUIPMENT_RESULT:
      return {
        ...state,
        resultList: action.payload
      }
    case GET_EQUIPMENT_LIST_ADVANCE_SEARCH:
      return {
        ...state,
        equipmentListAdvanceSearch: action.payload
      }
    default:
      return {
        ...state
      }
  }
}