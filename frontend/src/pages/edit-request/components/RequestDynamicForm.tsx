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
  Spin,
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
}

export default function RequestDynamicForm({
  form,
  fieldsFromProduct,
  fieldsFromRequest,
}: RequestDynamicFormProps): JSX.Element {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const [isFirstValueChanged, setIsFirstValueChanged] = useState(true);
  const [fieldsFromRequestState, setFieldsFromRequestState] = useState<
    RequestGroupProps[] | RequestGroupProps
  >(fieldsFromRequest);

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [fileNameUploading, setFileNameUploading] = useState('');

  async function handleAntdUpload(info, index: number, fieldItemName: string) {
    const { file } = info;

    const { fieldsValues } = form.getFieldsValue();

    if (file.status === 'removed') {
      fieldsValues[index][fieldItemName] = fieldsFromRequestState[index].fields[
        fieldItemName
      ].filter(item => item !== file.uid);
      form.setFieldsValue({ fieldsValues });
      setFieldsFromRequestState(
        form.getFieldsValue().fieldsValues.map((field, indexField) => ({
          title: fieldsFromRequestState[indexField].title,
          fields: { ...field },
        })),
      );
    }
  }

  async function handleUpload(info, index: number, fieldItemName: string) {
    const { file } = info;

    const { fieldsValues } = form.getFieldsValue();

    try {
      setIsUploadingFile(true);
      setFileNameUploading(file.name);

      const storageRef = app.storage().ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      const fileUrl = await fileRef.getDownloadURL();
      const updateInputFiles = [
        ...fieldsFromRequestState[index].fields[fieldItemName],
        fileUrl,
      ];
      fieldsValues[index][fieldItemName] = updateInputFiles;
      form.setFieldsValue({ fieldsValues });
      setFieldsFromRequestState(
        form.getFieldsValue().fieldsValues.map((field, indexField) => ({
          title: fieldsFromRequestState[indexField].title,
          fields: { ...field },
        })),
      );

      setIsUploadingFile(false);
      setFileNameUploading('');

      message.success(`${file.name} arquivo enviado com sucesso.`);
    } catch (err) {
      message.error(`${file.name} falha no envio do arquivo.`);
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
    <Spin
      spinning={isUploadingFile}
      tip={`Fazendo upload do arquivo ${fileNameUploading}`}
    >
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
                    fieldKey={['fieldsValues', index, fieldItem.name]}
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
                    fieldKey={['fieldsValues', index, fieldItem.name]}
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
                        fieldKey={['fieldsValues', index, fieldItem.name]}
                      >
                        <Select
                          onSelect={() => {
                            forceUpdate();
                            setIsFirstValueChanged(false);
                          }}
                        >
                          {fieldItem.options.map(option => (
                            <Select.Option key={option} value={option}>
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
                        initialValue={
                          fieldsFromRequest[index].fields[fieldItem.name]
                        }
                        fieldKey={['fieldsValues', index, fieldItem.name]}
                      >
                        <Input />
                      </Item>
                    ) : (
                      <Item
                        label={fieldItem.label}
                        name={['fieldsValues', index, fieldItem.name]}
                        initialValue={
                          fieldsFromRequest[index].fields[fieldItem.name]
                        }
                        fieldKey={['fieldsValues', index, fieldItem.name]}
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
                      fieldsFromRequest[index]?.fields[fieldItem.name]
                    }
                  >
                    <Dragger
                      name="file"
                      onChange={file =>
                        handleAntdUpload(file, index, fieldItem.name)
                      }
                      customRequest={file =>
                        handleUpload(file, index, fieldItem.name)
                      }
                      fileList={fieldsFromRequestState[index]?.fields[
                        fieldItem.name
                      ].map((file: string) => ({
                        name: file.substring(
                          file.lastIndexOf('/') + 1,
                          file.lastIndexOf('?'),
                        ),
                        url: file,
                        uid: file,
                        size: 10,
                        type: 'file',
                      }))}
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
    </Spin>
  );
}
