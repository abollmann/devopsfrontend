import React, {useEffect, useRef, useState} from 'react'
import {Form, Input, Button, Select, Divider, Alert} from 'antd'
import tenantService from '../services/tenants'
import {useDispatch, useSelector} from 'react-redux'
import {getAllBuildings} from '../redux/buildings/reducer'
import {concatAddress} from './helper'

const {Option} = Select
const layout = {
  labelCol: {
    span: 2,
    offset: 8,
  },
  wrapperCol: {
    offset: 0,
    span: 6,
  },
  type: 'flex',
  justify: 'center',
}
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 8,
  },
  type: 'flex',
  justify: 'center',
}

const TenantForm = () => {
  const [successMessage, setSuccessMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const formRef = useRef(null)
  const keycloak = useSelector(state => state.auth.keycloak)

  const dispatch = useDispatch()
  const buildings = useSelector(state => state.buildings.data)
  useEffect(() => {
    async function collectInitialData() {
      if (keycloak !== null) {
        dispatch(getAllBuildings(keycloak.token))
      }
    }

    collectInitialData()
  }, [dispatch, keycloak])


  const onFinish = values => {
    delete values['customizeGender']
    tenantService.create(keycloak.token, values)
      .then(() => setSuccessMessage(true))
      .catch(() => setErrorMessage(true))
  }

  const onReset = () => {
    formRef.current.resetFields()
  }

  return (

    <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish}>
      {successMessage &&
      <Alert
        message="Mieter erstellt"
        type="success"
        showIcon
        closable
        onClose={() => setSuccessMessage(false)}
      />
      }
      {errorMessage &&
      <Alert
        message="Mieter konnte nicht erstellt werden"
        description="Serververbindung oder Mailadresse nicht einzigartig"
        type="error"
        showIcon
        closable
        onClose={() => setErrorMessage(false)}
      />
      }
      <Divider orientation="center">Persönliche Daten</Divider>
      <Form.Item
        name="first_name"
        label="Vorname"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="last_name"
        label="Nachname"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            type: 'email',
            required: true,
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="home_building"
        label="Gebäude"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={"Wohnsitz auswählen"}
          allowClear
        >
          {buildings.map(building => <Option key={building['_id']}
                                             value={building['_id']}>{concatAddress(building)}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        name="gender"
        label="Geschlecht"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Geschlecht auswählen"
          allowClear
        >
          <Option value="männlich">männlich</Option>
          <Option value="weiblich">weiblich</Option>
          <Option value="andere">andere</Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
      >
        {({getFieldValue}) =>
          getFieldValue('gender') === 'andere' ? (
            <Form.Item
              name="customizeGender"
              label="Gewünschtes Geschlecht"
              rules={[
                {
                  required: true,
                },
              ]}
              labelCol={{
                span: 4,
                offset: 6,
              }}
            >
              <Input/>
            </Form.Item>
          ) : null
        }
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Mieter erstellen
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Zurücksetzen
        </Button>
      </Form.Item>
    </Form>

  )
}


export default TenantForm