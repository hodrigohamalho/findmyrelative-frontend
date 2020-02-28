import { requestDetails, recieveDetails, searchName } from './actionCreators'
import { REQUEST_DETAILS, RECIEVE_DETAILS } from './reduxTypes'

it('should create an action to update victim name', () => {
  const name = 'Chuck Norris'
  const expectedAction = {
    type: REQUEST_DETAILS,
    payload: { name }
  }
  expect(requestDetails(name)).toEqual(expectedAction)
})

it('should create action to update recieved details', () => {
  const expectedAction = {
    type: RECIEVE_DETAILS,
    payload: { isSuccessful: true, data: ['example_data'] }
  }
  expect(recieveDetails(true, [{ map: 'example_data' }])).toEqual(
    expectedAction
  )
})

it('should dispatch the actions to update store during API call', () => {
  const fn = jest.fn()
  searchName('test')(fn)
  expect(fn).toHaveBeenCalledWith({
    type: REQUEST_DETAILS,
    payload: { name: 'test' }
  })
})
