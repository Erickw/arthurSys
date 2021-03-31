/* eslint-disable react/require-default-props */
import { UploadOutlined } from '@ant-design/icons';
import { Input, Form, Select, DatePicker, Button } from 'antd';
import React from 'react';

const { Item } = Form;

interface ProductDynamicFormProps {
  fields?: InputGroupProps[];
}

export default function ProductDynamicForm({
  fields,
}: ProductDynamicFormProps): JSX.Element {
  return (
    <>
      {fields &&
        fields.map((field, index) => (
          <>
            <h2>{field.title}</h2>
            {field.fields?.map(fieldItem => (
              <>
                {fieldItem.type === 'string' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, preencha esse campo',
                      },
                    ]}
                  >
                    <Input />
                  </Item>
                )}
                {fieldItem.type === 'number' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, preencha esse campo',
                      },
                    ]}
                  >
                    <Input type="number" />
                  </Item>
                )}
                {fieldItem.type === 'select' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, preencha esse campo',
                      },
                    ]}
                  >
                    <Select>
                      {fieldItem.options.map(option => (
                        <Select.Option value={option}>{option}</Select.Option>
                      ))}
                    </Select>
                  </Item>
                )}
                {fieldItem.type === 'date' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    fieldKey={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" />
                  </Item>
                )}
                {fieldItem.type === 'file' && (
                  <Item
                    label={fieldItem.label}
                    name={['fields', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, preencha esse campo!`,
                      },
                      {
                        whitespace: true,
                        message: 'Por favor, preencha esse campo',
                      },
                    ]}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Item>
                )}
              </>
            ))}
          </>
        ))}
    </>
  );
}
