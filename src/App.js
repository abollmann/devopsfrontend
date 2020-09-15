import React from 'react'
import './App.css'
import Auth from './components/Auth'
import SiteLayout from './containers/SiteLayout'
import 'antd/dist/antd.css'


const App = () => {
  return (
   <>
      <Auth/>
      <SiteLayout/>
    </>
  )

}

export default App
