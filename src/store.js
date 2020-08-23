import reducers from './redux/reducers'
import {composeWithDevTools} from 'redux-devtools-extension'
import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'


const store = createStore(reducers,
  composeWithDevTools(applyMiddleware(thunk)))

export default store