import { combineReducers } from 'redux'
import { nameReducer } from './reducers/name'
import { detailsReducer } from './reducers/details'
import { shelterReducer } from './reducers/shelter'

export const rootReducer = combineReducers({
  name: nameReducer,
  details: detailsReducer,
  shelter: shelterReducer
})

export type RootState = ReturnType<typeof rootReducer>;
