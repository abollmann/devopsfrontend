import React, {useEffect, useState} from 'react'
import {Layout, Menu, Avatar} from 'antd'
import {
  DatabaseOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ShareAltOutlined,
  MenuUnfoldOutlined,
  UserAddOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './SiteLayout.css'
import {useDispatch, useSelector} from 'react-redux'
import Devices from '../components/Devices'
import {authActions} from '../redux/auth/actions'
import {getRole} from '../components/helper'
import {getAllDevices} from '../redux/devices/reducer'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import TenantForm from '../components/TenantForm'
import TenantDevicesForm from '../components/TenantDevicesForm'
import Tenants from '../components/Tenants';

const {Header, Sider, Content} = Layout

const SiteLayout = () => {
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false)
  const {user, keycloak} = useSelector(state => state.auth)
  const toggle = () => setCollapsed(!collapsed)

  const logout = () => {
    keycloak.logout()
    dispatch(authActions.logout())
  }

  useEffect(() => {
    async function collectInitialData() {
      if (keycloak.token !== undefined) {
        dispatch(getAllDevices(keycloak.token))
      }
    }

    collectInitialData()
  }, [dispatch, keycloak])

  if (user === null) {
    return null
  }


  return (
    <Router>
      <Layout id="sidebar-components-layout">
        <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="lg">
          <div className="logo">
          </div>
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1" icon={<DatabaseOutlined/>}>
              <Link to="/">Mieterdaten</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserAddOutlined/>}>
              <Link to="/users">Nutzer erstellen</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ShareAltOutlined/>}>
              <Link to="/devices">Geräte zuweisen</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<LogoutOutlined/>} onClick={logout}>
              <Link to="/">Logout</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{padding: 0}}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle
            })}
            <Avatar size="small"
                    icon={<UserOutlined/>}/> {user.preferred_username}, {getRole(user)}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <Switch>
              <Route path="/users">
                <TenantForm />
              </Route>
              <Route path="/devices">
                <TenantDevicesForm />
              </Route>
              <Route path="/">
                <Tenants />
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default SiteLayout