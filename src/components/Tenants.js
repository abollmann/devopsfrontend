import {useDispatch, useSelector} from 'react-redux'
import React, {useEffect} from 'react'
import { Table, Button} from 'antd'
import {getAllTenants} from '../redux/tenants/reducer'
import {concatAddress} from './helper'

const ButtonGroup = Button.Group;

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
    dataIndex: 'bill',
    sorter: (a, b) => a.meter_value - b.meter_value,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Aktionen',
    dataIndex: '',
    key: 'x',
    render: () => (
      <ButtonGroup>
        <Button>Bearbeiten</Button>
        <Button>Geräte</Button>
      </ButtonGroup>
    ),
  }
]


const formatTenantData = (tenants) => {
  return tenants.map(tenant => {
    return {
      ...tenant,
      key: tenant['_id'],
      devices: tenant.devices.length,
      name: `${tenant.first_name} ${tenant.last_name}`,
      bill: `${tenant.bill}€`,
      home: concatAddress(tenant.home)
    }
  })
}


const Tenants = () => {
  const dispatch = useDispatch()
  const keycloak = useSelector(state => state.auth.keycloak)
  const tenants = useSelector(state => state.tenants.data)

  useEffect(() => {
    async function collectInitialData() {
      if (keycloak.token !== undefined) {
        dispatch(getAllTenants(keycloak.token))
      }
    }

    collectInitialData()
  }, [dispatch, keycloak])

  console.log(tenants)
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