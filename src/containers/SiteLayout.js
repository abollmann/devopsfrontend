import React, {useState} from 'react'
import {Layout, Menu, Avatar} from 'antd'
import {
  DatabaseOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ShareAltOutlined,
  MenuUnfoldOutlined,
  UserAddOutlined,
  LogoutOutlined,
  UsergroupDeleteOutlined
} from '@ant-design/icons'
import './SiteLayout.css'
import {useDispatch, useSelector} from 'react-redux'
import {authActions} from '../redux/auth/actions'
import {getRole} from '../components/helper'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom'
import TenantForm from '../components/TenantForm'
import TenantDevicesForm from '../components/TenantDevicesForm'
import Tenants from '../components/Tenants';
import Devices from '../components/Devices';

const {Header, Sider, Content, Footer} = Layout

const SiteLayout = () => {
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false)
  const {user, keycloak} = useSelector(state => state.auth)
  const toggle = () => setCollapsed(!collapsed)

  const logout = () => {
    dispatch(authActions.logout())
    keycloak.logout()
  }

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
            <Menu.Item key="1" icon={<UsergroupDeleteOutlined/>}>
              <Link to="/">Mieterdaten</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<DatabaseOutlined/>}>
              <Link to="/devices">Gerätedaten</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UserAddOutlined/>}>
              <Link to="/users">Mieter erstellen</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<ShareAltOutlined/>}>
              <Link to="/distribute">Geräte zuweisen</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<LogoutOutlined/>} onClick={logout}>
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
                    icon={<UserOutlined/>}/> <b>{user.preferred_username}, {getRole(user)}</b>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: '100vh',
            }}
          >
            <Switch>
              <Route path="/users">
                <TenantForm />
              </Route>
              <Route path="/devices">
                <Devices />
              </Route>
              <Route path="/distribute">
                <TenantDevicesForm/>
              </Route>
              <Route path="/">
                <Tenants />
              </Route>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>@DevOps SS2020</Footer>
        </Layout>
        <Sider/>
      </Layout>
    </Router>
  )
}

export default SiteLayout