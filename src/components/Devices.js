import {useDispatch, useSelector} from 'react-redux'
import React, {useEffect} from 'react'
import { Table } from 'antd'
import {timeConverter} from './helper'


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
]


const formatDeviceData = (data) => {
  return data.map(device => {
    const key = `${device.building_id}_${device.room_nr}`
    return {
      ...device,
      key: key,
      name: key,
      temperature: `${Number(device.temperature).toFixed(2)}°`,
      timestamp: timeConverter(device.timestamp)
    }
  })
}


const Devices = () => {
  const {data, error} = useSelector(state => state.devices)
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