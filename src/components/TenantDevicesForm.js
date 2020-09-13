import React, {useEffect, useRef, useState} from 'react'
import {Form, Button, Select, Divider, Alert, Popconfirm} from 'antd'
import { useHistory } from 'react-router'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'
import {getAllDevices} from '../redux/devices/reducer'
import {getAllTenants} from '../redux/tenants/reducer'
import {getAllBuildings} from '../redux/buildings/reducer'
import {concatAddress} from './helper'
import tenantService from '../services/tenants'

const {Option} = Select

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 12,
  },
  type: 'flex',
  justify: 'center',
}

const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 12,
  },
}

const TenantDevicesForm = () => {
  const formRef = useRef(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [eligibleDevices, setEligibleDevices] = useState([])
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [selectedBuilding, setSelectedBuilding] = useState(null)

  const dispatch = useDispatch()
  const keycloak = useSelector(state => state.auth.keycloak)
  const devices = useSelector(state => state.devices.data)
  const tenants = useSelector(state => state.tenants.data)
  const buildings = useSelector(state => state.buildings.data)

  const location = useLocation()
  const history = useHistory()


  useEffect(() => {
    async function collectInitialData() {
      if (keycloak.token !== undefined) {
        dispatch(getAllDevices(keycloak.token))
        dispatch(getAllTenants(keycloak.token))
        dispatch(getAllBuildings(keycloak.token))
      }
      if (location.state !== undefined) {
        setSelectedTenant(location.state.tenant)
      }
    }

    collectInitialData()

  }, [dispatch, keycloak, location])


  // DATA
  const getHomeBuilding = () => {
    if (selectedTenant === null)
      return null
    const tenant = tenants.find(t => t['_id'] === selectedTenant)
    if (tenant === null || tenant.home_building === undefined || tenant.home_building === null)
      return null
    return tenant.home_building
  }

  const buildingOptions = () => {
    if (selectedTenant === null)
      return null
    const homeBuilding = getHomeBuilding()
    return buildings
      .filter(building => homeBuilding === null || building['_id'] === homeBuilding)
      .map(building => {
        return <Option key={building['_id']}
                       value={building['_id']}>{concatAddress(building)}</Option>
      })
  }

  const tenantOptions = () => {
    return tenants.map(tenant => <Option key={tenant['_id']}
                                         value={tenant['_id']}>{tenant.first_name} {tenant.last_name}</Option>)
  }

  const deviceOptions = () => {
    if (selectedBuilding === null)
      return null
    return eligibleDevices.map(device => <Option key={device['_id']}
                                                 value={device['_id']}>{device.building_id}_{device.room_nr}</Option>)
  }

  // HANDLERS
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

  const onFinish = data => {
    tenantService.distributeDevices(keycloak.token, data)
      .then(() => {
        setSuccessMessage('Geräte erfolgreich hinzugefügt')
      })
      .catch(() => setErrorMessage('Geräte konnten nicht hinzugefügt werden'))
    onReset()
  }

  const removeDevices = () => {
    tenantService.distributeDevices(keycloak.token, {tenant_id: selectedTenant, device_ids: []})
      .then(() => {
        setSuccessMessage('Geräte erfolgreich entfernt')
      })
      .catch(() => setErrorMessage('Geräte konnten nicht enternt werden'))
    onReset()
  }

  const onReset = () => {
    formRef.current.resetFields()
    handleDeselectTenant()
    history.push(0)
  }

  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      initialValues={{'tenant_id': selectedTenant}}>
      {successMessage &&
      <Alert
        message={successMessage}
        type="success"
        showIcon
        closable
        onClose={() => setSuccessMessage(null)}
      />
      }
      {errorMessage &&
      <Alert
        message={errorMessage}
        description="Serververbindung bitte überprüfen"
        type="error"
        showIcon
        closable
        onClose={() => setErrorMessage(null)}
      />
      }
      <Divider orientation="center">Geräte zuweisen</Divider>
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
          onClear={handleDeselectTenant}
          allowClear
        >
          {tenantOptions()}
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
          placeholder="Gebäude auswählen"
          onSelect={handleSelectBuilding}
          onDeselect={handleDeselectBuilding}
          onClear={handleDeselectBuilding}
          allowClear
        >
          {buildingOptions()}
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
          {deviceOptions()}
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Bestätigen
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Zurücksetzen
        </Button>
        <Popconfirm title="ALLE zugewiesenen Geräte entfernen" okText="Ja" cancelText="Nein" onConfirm={removeDevices}>
          <Button type="danger" disabled={selectedTenant === null}>
            Geräte entfernen
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  )
}

export default TenantDevicesForm