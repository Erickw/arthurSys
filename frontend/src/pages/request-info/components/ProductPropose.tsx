import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Card, Upload, Result, message, Spin } from 'antd';
import { app } from '../../../config/firebase';
import { ProductProposeContainer } from '../../../styles/pages/request-info';

const { Dragger } = Upload;

interface ProductProposeParams {
  isAdminCadist: boolean;
  productPropose: string;
  handleUploadProductProposeFile: (fileUrl: string) => void;
  handleRemoveProductPropose: () => void;
}

export default function ProductPropose({
  isAdminCadist,
  productPropose,
  handleUploadProductProposeFile,
  handleRemoveProductPropose,
}: ProductProposeParams): JSX.Element {
  const [productProposeFile, setProductProposeFile] = useState<string>(
    productPropose,
  );
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  async function handleUploadFile(file) {
    try {
      setIsUploadingFile(true);

      const storageRef = app.storage().ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      const fileUrl = await fileRef.getDownloadURL();

      setProductProposeFile(fileUrl);

      setIsUploadingFile(false);
      handleUploadProductProposeFile(fileUrl);
    } catch (err) {
      message.error(`${file.name} falha no envio do arquivo.`);
    }
  }

  async function handleRemoveFile(file) {
    // console.log(file);
    if (file.status === 'removed') {
      setProductProposeFile('');
      handleRemoveProductPropose();
    }
  }

  return (
    <Spin spinning={isUploadingFile} tip="Fazendo upload da prosposta.">
      <ProductProposeContainer isClient={!isAdminCadist}>
        <Card
          title="Proposta de Produto"
          style={{ marginTop: 24, minWidth: 450 }}
          bordered={false}
        >
          {!isAdminCadist && productProposeFile === '' && (
            <Result
              status="404"
              subTitle="Parece que ainda não foi feito uma proposta para essa requisição."
            />
          )}
          <Dragger
            name="file"
            listType="picture"
            showUploadList={productProposeFile !== ''}
            fileList={[
              {
                uid: '1',
                name: productProposeFile.substring(
                  productProposeFile.lastIndexOf('/') + 1,
                  productProposeFile.lastIndexOf('?'),
                ),
                url: productProposeFile,
                thumbUrl: productProposeFile,
                size: 10,
                type: 'file',
              },
            ]}
            onChange={({ file }) => handleRemoveFile(file)}
            customRequest={({ file }) => handleUploadFile(file)}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Clique ou arraste o arquivo para esta área para fazer o upload
            </p>
            <p className="ant-upload-hint">
              Você deve fazer o upload da proposta do produto aqui.
            </p>
          </Dragger>
        </Card>
      </ProductProposeContainer>
    </Spin>
  );
}
