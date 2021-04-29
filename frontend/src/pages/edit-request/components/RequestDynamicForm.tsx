/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable react/require-default-props */
import { InboxOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  Input,
  Form,
  Select,
  DatePicker,
  message,
  FormInstance,
  Tooltip,
} from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import moment from 'moment';
import React, { useReducer, useState } from 'react';
import { app } from '../../../config/firebase';

const { Item } = Form;

interface RequestDynamicFormProps {
  form: FormInstance;
  fieldsFromProduct?: InputGroupProps[];
  fieldsFromRequest: RequestGroupProps[] | RequestGroupProps;
  onUpdateFile: (url: string, index: number, fieldItemName: string) => void;
}

export default function RequestDynamicForm({
  form,
  fieldsFromProduct,
  fieldsFromRequest,
  onUpdateFile,
}: RequestDynamicFormProps): JSX.Element {
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
      {fieldsFromProduct &&
        fieldsFromProduct.map((field, index) => (
          <div key={field.title}>
            <h2>{field.title}</h2>
            {field.fields.map(fieldItem => (
              <div key={fieldItem.name}>
                {fieldItem.type === 'string' && (
                  <Item
                    label={fieldItem.label}
                    name={['fieldsValues', index, fieldItem.name]}
                    initialValue={
                      fieldsFromRequest[index].fields[fieldItem.name]
                    }
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
                    initialValue={
                      fieldsFromRequest[index].fields[fieldItem.name]
                    }
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
                        initialValue={
                          fieldsFromRequest[index].fields[fieldItem.name]
                        }
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
                    fieldKey={['fieldsValues', index, fieldItem.name]}
                    initialValue={moment(
                      fieldsFromRequest[index].fields[fieldItem.name],
                    )}
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
                    fieldKey={['fieldsValues', index, fieldItem.name]}
                    initialValue={
                      fieldsFromRequest[index].fields[fieldItem.name]
                    }
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
