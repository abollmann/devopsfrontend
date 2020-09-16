import {useDispatch, useSelector} from 'react-redux'
import React, {useEffect} from 'react'
import {Table, Button, Popconfirm, Divider} from 'antd'
import {getAllTenants} from '../redux/tenants/reducer'
import {concatAddress} from './helper'
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
          <Popconfirm title="Mieter abrechnen?" okText="Ja" cancelText="Abbrechen"
                      onConfirm={() => {
                        deviceService.resetMeterValue(keycloak.token, {tenant_id: id})
                        dispatch(getAllTenants(keycloak.token))
                      }}>
            <Button>Abrechnen</Button>
          </Popconfirm>
          <Popconfirm title="Mieter löschen?" okText="Ja" cancelText="Abbrechen"
                      onConfirm={() => {
                        tenantService.deleteTenant(keycloak.token, id)
                        dispatch(getAllTenants(keycloak.token))
                      }}>
            <Button type="danger">Löschen</Button>
          </Popconfirm>
        </ButtonGroup>
      ),
    }
  ]

  const options = {
    bordered: true,
    pagination: {position: 'bottom'},
    title: () => <Divider orientation="center">Mieterdaten</Divider>
  }
  if (tenants == null) return null
  return (
    <div>
      <Table {...options} columns={columns} dataSource={formatTenantData(tenants)}/>
    </div>
  )
}

export default Tenants