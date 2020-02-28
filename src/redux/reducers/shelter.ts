import { ShelterDetail } from '../../types'
import { RECIEVE_SHELTER, RecieveShelterType } from '../reduxTypes'

interface StateType {
  [id: string]: ShelterDetail;
}

export function shelterReducer (
  state = {},
  action: RecieveShelterType
): StateType {
  if (action.type === RECIEVE_SHELTER) {
    return { ...state, [action.payload.id]: action.payload.data }
  }
  return state
}
