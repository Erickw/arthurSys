/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { InboxOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  Input,
  Form,
  Select,
  DatePicker,
  Upload,
  message,
  FormInstance,
  Tooltip,
} from 'antd';
import React, { useReducer, useState } from 'react';

import { app } from '../../../config/firebase';

const { Item } = Form;
const { Dragger } = Upload;
interface ProductDynamicFormProps {
  form: FormInstance;
  fields?: InputGroupProps[];
  onUpdateFile: (url: string, index: number, fieldItemName: string) => void;
}

export default function ProductDynamicForm({
  form,
  fields,
  onUpdateFile,
}: ProductDynamicFormProps): JSX.Element {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const [isFirstValueChanged, setIsFirstValueChanged] = useState(true);

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

  function handleAlternativeOutput(
    index: number,
    fieldName: string,
    fieldsData: any,
  ) {
    const checkValue = fieldsData[index][fieldName];
    if (String(checkValue).toLowerCase() === 'outro') {
      return true;
    }
    return false;
  }

  function handleBackToDefaultDynamicOptions(index: number, fieldItem: any) {
    const dynamicFields = form.getFieldsValue().fieldsValues;
    dynamicFields[index][fieldItem.name] = fieldItem.options[0];
    form.setFieldsValue({
      fieldsValues: dynamicFields,
    });
    forceUpdate();
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
                  <>
                    {isFirstValueChanged ? (
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
                        <Select
                          onSelect={() => {
                            forceUpdate();
                            setIsFirstValueChanged(false);
                          }}
                        >
                          {fieldItem.options.map(option => (
                            <Select.Option value={option}>
                              {option}
                            </Select.Option>
                          ))}
                        </Select>
                      </Item>
                    ) : handleAlternativeOutput(
                        index,
                        fieldItem.name,
                        form.getFieldsValue().fieldsValues,
                      ) ? (
                      <Item
                        label={
                          <>
                            {fieldItem.label}
                            <Tooltip title="Voltar para opções anteriores">
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() =>
                                  handleBackToDefaultDynamicOptions(
                                    index,
                                    fieldItem,
                                  )
                                }
                                style={{ marginLeft: '16px' }}
                              />
                            </Tooltip>
                          </>
                        }
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
                    ) : (
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
                        <Select onSelect={() => forceUpdate()}>
                          {fieldItem.options.map(option => (
                            <Select.Option value={option}>
                              {option}
                            </Select.Option>
                          ))}
                        </Select>
                      </Item>
                    )}
                  </>
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
                      beforeUpload={() => false}
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
