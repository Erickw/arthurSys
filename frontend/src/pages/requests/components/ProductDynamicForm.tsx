/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { InboxOutlined } from '@ant-design/icons';
import { Input, Form, Select, DatePicker, Upload, message } from 'antd';
import React from 'react';

import { app } from '../../../config/firebase';

const { Item } = Form;
const { Dragger } = Upload;
interface ProductDynamicFormProps {
  fields?: InputGroupProps[];
  onUpdateFile: (url: string, index: number, fieldItemName: string) => void;
}

export default function ProductDynamicForm({
  fields,
  onUpdateFile,
}: ProductDynamicFormProps): JSX.Element {
  async function handleUpload(info, index, fieldItemName) {
    const { file } = info;
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    const fileUrl = await fileRef.getDownloadURL();
    onUpdateFile(fileUrl, index, fieldItemName);

    if (file.status === 'done') {
      message.success(`${info.file.name} arquivo enviado com sucesso.`);
    } else if (file.status === 'error') {
      message.error(`${info.file.name} falha no envio do arquivo.`);
    }
  }

  return (
    <>
      {fields &&
        fields.map((field, index) => (
          <div key={field.title}>
            <h2>{field.title}</h2>
            {field.fields.map(fieldItem => (
              <div key={fieldItem.name}>
                {fieldItem.type === 'string' && (
                  <Item
                    label={fieldItem.label}
                    name={['fieldsValues', index, fieldItem.name]}
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
                    name={['fieldsValues', index, fieldItem.name]}
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
                    name={['fieldsValues', index, fieldItem.name]}
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
                    name={['fieldsValues', index, fieldItem.name]}
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
                    name={['fieldsValues', index, fieldItem.name]}
                    rules={[
                      {
                        required: true,
                        message: `Por favor, faça o upload do arquivo ${fieldItem.label}`,
                      },
                    ]}
                  >
                    <Dragger
                      name="file"
                      maxCount={1}
                      onChange={file =>
                        handleUpload(file, index, fieldItem.name)
                      }
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Clique ou arraste o arquivo para esta área para fazer o
                        upload
                      </p>
                      <p className="ant-upload-hint">
                        {`Você deve fazer o upload do arquivo ${fieldItem.label} aqui.`}
                      </p>
                    </Dragger>
                  </Item>
                )}
              </div>
            ))}
          </div>
        ))}
    </>
  );
}
