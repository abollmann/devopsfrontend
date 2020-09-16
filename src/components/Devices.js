import {useDispatch, useSelector} from 'react-redux'
import React, {useEffect} from 'react'
import { Table } from 'antd'
import {timeConverter} from './helper'
import {getAllDevices} from '../redux/devices/reducer';


const columns = [
  {
    title: 'Gerätename',
    dataIndex: 'name',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.name - b.name,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Letzte Messung',
    dataIndex: 'timestamp',
    sorter: (a, b) => a.timestamp - b.timestamp,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Temperatur',
    dataIndex: 'temperature',
    sorter: (a, b) => a.temperature - b.temperature,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Messwert',
    dataIndex: 'meter_value_diff',
    sorter: (a, b) => a.meter_value - b.meter_value,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Belegt',
    dataIndex: 'occupied',
    sorter: (a, b) => a.occupied - b.occupied,
    sortDirections: ['descend', 'ascend'],
  }
]


const formatDeviceData = (data) => {
  return data.map(device => {
    const key = `${device.building_id}_${device.room_nr}`
    return {
      ...device,
      key: key,
      name: key,
      temperature: `${Number(device.temperature).toFixed(2)}°`,
      timestamp: timeConverter(device.timestamp),
      occupied: (device.tenant !== undefined && device.tenant !== null) ? 'Ja' : 'Nein'
    }
  })
}


const Devices = () => {
  const dispatch = useDispatch()
  const keycloak = useSelector(state => state.auth.keycloak)
  const devices = useSelector(state => state.devices.data)

  useEffect(() => {
    async function collectInitialData() {
      if (keycloak !== null) {
        dispatch(getAllDevices(keycloak.token))
      }
    }

    collectInitialData()
  }, [dispatch, keycloak])

  console.log(devices)
  const options = {
    bordered: true,
    pagination: { position: 'bottom' },
    title: () => 'Gerätedaten'
  }
  return (
    <div>
      <Table {...options} columns={columns} dataSource={formatDeviceData(devices)} />
    </div>
  )
}

export default Devices