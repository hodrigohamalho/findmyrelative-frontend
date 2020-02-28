import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { rootReducer } from './redux/reducers'
import '@patternfly/react-core/dist/styles/base.css'

import Homepage from './Homepage'

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

const App: React.FC = () => {
  return (
    <Router>
      <Provider store={store}>
        <Route path="/" component={Homepage} />
      </Provider>
    </Router>
  )
}

export default App
