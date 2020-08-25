import React, {useEffect, useRef, useState} from 'react'
import {Form, Button, Select} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {getAllDevices} from '../redux/devices/reducer'
import {getAllTenants} from '../redux/tenants/reducer'
import {getAllBuildings} from '../redux/buildings/reducer'
import {concatAddress} from './helper'
import tenantService from '../services/tenants'

const {Option} = Select

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const TenantDevicesForm = () => {
  const formRef = useRef(null)
  const [eligibleDevices, setEligibleDevices] = useState([])
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [selectedBuilding, setSelectedBuilding] = useState(null)

  const dispatch = useDispatch()
  const keycloak = useSelector(state => state.auth.keycloak)
  const devices = useSelector(state => state.devices.data)
  const tenants = useSelector(state => state.tenants.data)
  const buildings = useSelector(state => state.buildings.data)

  console.log(devices)

  useEffect(() => {
    async function collectInitialData() {
      if (keycloak.token !== undefined) {
        dispatch(getAllDevices(keycloak.token))
        dispatch(getAllTenants(keycloak.token))
        dispatch(getAllBuildings(keycloak.token))
      }
    }

    collectInitialData()
  }, [dispatch, keycloak])


  const handleSelectTenant = tenant => {
    setSelectedTenant(tenant)
  }

  const handleSelectBuilding = building => {
    setSelectedBuilding(building)
    setEligibleDevices(devices.filter(device => device.building_id === building && device.tenant === null))
  }

  const handleDeselectTenant = () => {
    setSelectedTenant(null)
    setSelectedBuilding(null)
    setEligibleDevices([])
  }

  const handleDeselectBuilding = () => {
    setSelectedBuilding(null)
    setEligibleDevices([])
  }
  // buildings: "AB1"
  // devices: (2) ["5f45241548319e8c6c5da6ee", "5f45241548319e8c6c5da6ed"]
  // tenant: "5f4526da381e57c07964b9f7"
  const onFinish = data => {
    tenantService.distributeDevices(keycloak.token, data).then(console.log).catch(console.log)
  }

  return (
    <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish}>
      <Form.Item
        name="tenant_id"
        label="Mieter"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Mieter auswählen"
          onSelect={handleSelectTenant}
          onDeselect={handleDeselectTenant}
          allowClear
        >
          {tenants.map(tenant => <Option key={tenant['_id']}
                                         value={tenant['_id']}>{tenant.first_name} {tenant.last_name}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item
        name="buildings"
        label="Gebäude"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={selectedTenant !== null ? "Gebäude auswählen" : "Bitte erst einen Mieter auswählen"}
          onSelect={handleSelectBuilding}
          onDeselect={handleDeselectBuilding}
          allowClear
        >
          {selectedTenant === null ? [] :
            buildings.map(building => <Option key={building['_id']}
                                              value={building['_id']}>{concatAddress(building)}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item
        name="device_ids"
        label="Geräte"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={selectedBuilding !== null ? "Geräte auswählen" : "Bitte erst ein Gebäude auswählen"}
          mode="multiple"
          allowClear
        >
          {eligibleDevices.map(device => <Option key={device['_id']}
                                                 value={device['_id']}>{device.building_id}_{device.room_nr}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button">
          Reset
        </Button>
      </Form.Item>
    </Form>
  )
}

export default TenantDevicesForm