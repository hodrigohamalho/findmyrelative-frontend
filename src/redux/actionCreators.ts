import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from './reducers'
import {
  REQUEST_DETAILS,
  RECIEVE_DETAILS,
  RECIEVE_SHELTER,
  RequestDetailsType,
  RecieveDetailsType,
  RecieveShelterType,
  Action
} from './reduxTypes'
import { VictimDetail, ShelterDetail } from '../types'
import { getVictimData } from '../mock/mockSearchData'
import { getShelterData } from '../mock/mockShelterData'

export function requestDetails (name: string): RequestDetailsType {
  return { type: REQUEST_DETAILS, payload: { name } }
}

type RawVictimDetail = { map: VictimDetail };
export function recieveDetails (
  isSuccessful: boolean,
  data: RawVictimDetail[]
): RecieveDetailsType {
  const parsedData = data.map((item: RawVictimDetail) => item.map)
  return {
    type: RECIEVE_DETAILS,
    payload: { isSuccessful, data: parsedData }
  }
}

type AppThunk<ReturnType = void> = ThunkAction<
  void,
  RootState,
  unknown,
  Action
>;

const getAddress = (latitude: string, longitude: string): Promise<string> => {
  const fetchURL =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
    new URLSearchParams({
      /* eslint @typescript-eslint/camelcase: ["error", {allow: ["access_token"]}] */
      access_token: process.env.REACT_APP_MAPBOX_TOKEN as string
    })
  return fetch(fetchURL)
    .then((response) => response.json())
    .then((jsonData) => jsonData.features[0].place_name)
}

export function searchName (name: string): AppThunk {
  return async (dispatch: Dispatch): Promise<void> => {
    dispatch(requestDetails(name))
    if (process.env.REACT_APP_MOCK_API) {
      const mockResponse = getVictimData(name)
      const detailsList = mockResponse.map.victims.list
      for (let i = 0; i < detailsList.length; i++) {
        const address = await getAddress(
          detailsList[i].map.lat,
          detailsList[i].map.lon
        )
        detailsList[i].map.address = address
      }
      dispatch(recieveDetails(true, detailsList))
    } else {
      fetch(`http://findservice-user1-er-demo.apps.cluster-2h664.2h664.example.opentlc.com/find/victim/byName/${name}?user_key=1e9054e1e51a2795741be4d11157455e`)
        .then((response) => response.json())
        .then(
          async (data) => {
            const detailsList = data.map.victims.list
            for (let i = 0; i < detailsList.length; i++) {
              const address = await getAddress(
                detailsList[i].map.lat,
                detailsList[i].map.lon
              )
              detailsList[i].map.address = address
            }
            dispatch(recieveDetails(true, detailsList))
          },
          (error) => {
            dispatch(recieveDetails(false, []))
            console.error('Error making request: ', error)
          }
        )
    }
  }
}

export function recieveShelter (
  id: string,
  data: ShelterDetail
): RecieveShelterType {
  return { type: RECIEVE_SHELTER, payload: { id, data } }
}

export function fetchShelter (id: string) {
  return function (dispatch: Dispatch): void {
    if (process.env.REACT_APP_MOCK_API) {
      const shelterData = getShelterData(id)
      dispatch(recieveShelter(id, shelterData.map.shelter.map))
    } else {
      fetch(process.env.REACT_APP_BACKEND_URL + `/find/shelter/${id}`)
        .then((response) => response.json())
        .then((jsonData) => {
          dispatch(recieveShelter(id, jsonData.map.shelter.map))
        })
    }
  }
}
