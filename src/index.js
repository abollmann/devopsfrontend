import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import {Provider} from 'react-redux'
import store from './store'
import { ConfigProvider } from 'antd'
import deDE from 'antd/es/locale/de_DE'


ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={deDE}>
    <App/>
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
