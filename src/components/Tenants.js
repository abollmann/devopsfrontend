import {useDispatch, useSelector} from 'react-redux'
import React, {useEffect} from 'react'
import { Table, Button} from 'antd'
import {getAllTenants} from '../redux/tenants/reducer'
import {concatAddress} from './helper'
import { useHistory } from 'react-router-dom'
import tenantService from '../services/tenants'
import deviceService from '../services/devices'

const ButtonGroup = Button.Group
const MAGIC_NUMBER = 0.005

const formatTenantData = (tenants) => {
  return tenants.map(tenant => {
    return {
      ...tenant,
      key: tenant['_id'],
      devices: tenant.devices.length,
      name: `${tenant.first_name} ${tenant.last_name}`,
      total_meter_value: `${Number(tenant.total_meter_value * MAGIC_NUMBER).toFixed(2)}€`,
      home: concatAddress(tenant.home)
    }
  })
}


const Tenants = () => {
  const dispatch = useDispatch()
  const keycloak = useSelector(state => state.auth.keycloak)
  const tenants = useSelector(state => state.tenants.data)
  const history = useHistory()

  useEffect(() => {
    async function collectInitialData() {
      if (keycloak !== null) {
        dispatch(getAllTenants(keycloak.token))
      }
    }

    collectInitialData()
  }, [dispatch, keycloak])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.name - b.name,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Mailadresse',
      dataIndex: 'email',
      sorter: (a, b) => a.email - b.email,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Wohnsitz',
      dataIndex: 'home',
      sorter: (a, b) => a.email - b.email,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Geräte',
      dataIndex: 'devices',
      sorter: (a, b) => a.devices - b.devices,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Momentane Kosten',
      dataIndex: 'total_meter_value',
      sorter: (a, b) => a.total_meter_value - b.total_meter_value,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Aktionen',
      dataIndex: '_id',
      key: '_id',
      render: id => (
        <ButtonGroup>
          <Button onClick={() => history.push({pathname: '/devices', state: {tenant: id}})}>Geräte</Button>
          <Button onClick={() => deviceService.resetMeterValue(keycloak.token, {tenant_id: id})}>Abrechnen</Button>
          <Button type="danger" onClick={() => tenantService.deleteTenant(keycloak.token, id)}>Löschen</Button>
        </ButtonGroup>
      ),
    }
  ]

  const options = {
    bordered: true,
    pagination: { position: 'bottom' },
    title: () => 'Mieter'
  }
  if (tenants == null) return null
  return (
    <div>
      <Table {...options} columns={columns} dataSource={formatTenantData(tenants)} />
    </div>
  )
}

export default Tenants