import {useDispatch, useSelector} from 'react-redux'
import React, {useEffect} from 'react'
import { Table } from 'antd'
import {getAllTenants} from '../redux/tenants/reducer'


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
]


const formatTenantData = (tenants) => {
  return tenants.map(tenant => {
    return {
      ...tenant,
      key: tenant.email,
      devices: tenant.devices.length,
      name: `${tenant.first_name} ${tenant.last_name}`,
      bill: `${tenant.bill}€`
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