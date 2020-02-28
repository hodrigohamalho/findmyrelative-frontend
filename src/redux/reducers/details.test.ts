import { detailsReducer } from './details'
import { REQUEST_DETAILS, RECIEVE_DETAILS } from '../reduxTypes'

it('should return the initial state', () => {
  expect(detailsReducer(undefined, {})).toEqual({
    isFetching: false,
    isSuccessful: true,
    data: []
  })
})

it('should handle REQUEST_DETAILS type', () => {
  const nextState = detailsReducer(undefined, { type: REQUEST_DETAILS })
  expect(nextState.isFetching).toBe(true)
})

it('should update data on successful request', () => {
  const nextState = detailsReducer(undefined, {
    type: RECIEVE_DETAILS,
    payload: { isSuccessful: true, data: ['example_data'] }
  })
  expect(nextState.data).toEqual(['example_data'])
})

it('should clear data on failed request', () => {
  const nextState = detailsReducer(undefined, {
    type: RECIEVE_DETAILS,
    payload: { isSuccessful: false }
  })
  expect(nextState.data).toEqual([])
})
