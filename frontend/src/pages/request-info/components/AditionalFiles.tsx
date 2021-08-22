import { InboxOutlined } from '@ant-design/icons';
import { Card, message, Spin, Upload } from 'antd';
import React, { useState } from 'react';
import { app } from '../../../config/firebase';

const { Dragger } = Upload;

interface AditionalFilesParams {
  aditionalFiles: string[];
  handleUploadAditionalFile: (files: string[]) => void;
}

export default function AditionalFiles({
  aditionalFiles,
  handleUploadAditionalFile,
}: AditionalFilesParams): JSX.Element {
  const [files, setFiles] = useState<string[]>(aditionalFiles ?? []);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  async function handleUploadFile(file) {
    try {
      setIsUploadingFile(true);

      const storageRef = app.storage().ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      const fileUrl = await fileRef.getDownloadURL();

      const updateFiles = [...files];
      updateFiles.push(fileUrl);
      setFiles(updateFiles);

      setIsUploadingFile(false);
      handleUploadAditionalFile(updateFiles);
    } catch (err) {
      message.error(`${file.name} falha no envio do arquivo.`);
    }
  }

  async function handleRemoveAditionalFile(file) {
    if (file.status === 'removed') {
      const updateFiles = [...files].filter(fileItem => fileItem !== file.url);
      setFiles(updateFiles);
      handleUploadAditionalFile(updateFiles);
    }
  }

  return (
    <Spin spinning={isUploadingFile} tip="Fazendo upload do arquivo">
      <Card
        title="Arquivos Adicionais"
        style={{ marginTop: 24, minWidth: 450 }}
        bordered={false}
        loading={isUploadingFile}
      >
        <Dragger
          name="file"
          listType="picture"
          fileList={files.map(file => ({
            uid: file,
            name: file
              ? file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('?'))
              : '',
            url: file,
            thumbUrl: file,
            size: 10,
            type: 'file',
          }))}
          onChange={({ file }) => handleRemoveAditionalFile(file)}
          customRequest={({ file }) => handleUploadFile(file)}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Ficou faltando enviar algum arquivo ?
          </p>
          <p className="ant-upload-hint">Basta enviar o arquivo aqui.</p>
        </Dragger>
      </Card>
    </Spin>
  );
}
