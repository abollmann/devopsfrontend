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
    dataIndex: 'meter_value',
    sorter: (a, b) => a.meter_value - b.meter_value,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Rechnung',
    dataIndex: 'current_price',
    sorter: (a, b) => a.meter_value - b.meter_value,
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
      current_price: `${device.current_price}€`
    }
  })
}


const Devices = () => {
  const dispatch = useDispatch()
  const {user, keycloak} = useSelector(state => state.auth)
  const {data, error} = useSelector(state => state.devices)

  useEffect(() => {
    async function collectInitialData() {
      if (keycloak.token !== undefined) {
        dispatch(getAllDevices(keycloak.token))
      }
    }

    collectInitialData()
  }, [dispatch, keycloak])

  console.log(data)
  const options = {
    bordered: true,
    pagination: { position: 'bottom' },
    title: () => 'Messgeräte'
  }
  if (data == null) return null
  return (
    <div>
      <Table {...options} columns={columns} dataSource={formatDeviceData(data)} />
    </div>
  )
}

export default Devices