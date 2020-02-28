import { VictimDetail } from '../../types'
import {
  REQUEST_DETAILS,
  RECIEVE_DETAILS,
  RequestDetailsType,
  RecieveDetailsType
} from '../reduxTypes'

interface StateType {
  isFetching: boolean;
  isSuccessful: boolean;
  data: VictimDetail[];
}
const initialState: StateType = {
  isFetching: false,
  isSuccessful: true,
  data: []
}

type ActionType = RequestDetailsType & RecieveDetailsType;
export function detailsReducer (
  state = initialState,
  action: ActionType
): StateType {
  switch (action.type) {
    case REQUEST_DETAILS:
      return { ...state, isFetching: true }
    case RECIEVE_DETAILS:
      if (action.payload.isSuccessful) {
        return {
          ...state,
          isFetching: false,
          isSuccessful: true,
          data: action.payload.data
        }
      } else {
        return { ...state, isSuccessful: false, isFetching: false, data: [] }
      }
    default:
      return state
  }
}
