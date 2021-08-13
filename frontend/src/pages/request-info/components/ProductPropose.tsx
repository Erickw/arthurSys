import React, { useState } from 'react';
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { Card, Upload, Result, message, Spin, Button, Modal } from 'antd';
import { app } from '../../../config/firebase';
import {
  AproveRecuseButtons,
  ProductProposeContainer,
} from '../../../styles/pages/request-info';

const { Dragger } = Upload;
const { confirm } = Modal;

interface ProductProposeParams {
  isAdminCadist: boolean;
  proposeFile: string;
  proposeAnswered: boolean;
  proposeAccepted: boolean;
  handleUploadProductProposeFile: (fileUrl: string) => void;
  handleRemoveProductPropose: () => void;
  handleAcceptProductPropose: (answer: boolean) => void;
  handleChangeProductProposeAnswer: () => void;
}

export default function ProductPropose({
  isAdminCadist,
  proposeFile,
  proposeAnswered,
  proposeAccepted,
  handleUploadProductProposeFile,
  handleRemoveProductPropose,
  handleAcceptProductPropose,
  handleChangeProductProposeAnswer,
}: ProductProposeParams): JSX.Element {
  const [productProposeFile, setProductProposeFile] = useState<string>(
    proposeFile,
  );
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [answered, setAnswered] = useState(proposeAnswered);
  const [accepted, setAccepted] = useState(proposeAccepted);

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
    if (file.status === 'removed') {
      setProductProposeFile('');
      handleRemoveProductPropose();
    }
  }

  function productProposeAnswerModal(answer: boolean) {
    confirm({
      title: answer
        ? 'Você deseja aceitar essa proposta ?'
        : 'Você deseja recusar essa proposta ?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Sim',
      okType: answer ? 'primary' : 'danger',
      cancelText: 'Não',
      onOk() {
        setAccepted(answer);
        setAnswered(true);
        handleAcceptProductPropose(answer);
      },
    });
  }

  function alterProductProposeAnswer() {
    confirm({
      title: 'Você deseja alterar a resposta ?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk() {
        setAccepted(false);
        setAnswered(false);
        handleChangeProductProposeAnswer();
      },
    });
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
              subTitle="Parece que ainda não foi feita uma proposta para essa requisição."
            />
          )}
          <Dragger
            name="file"
            listType="picture"
            showUploadList={productProposeFile !== ''}
            fileList={[
              {
                uid: '1',
                name: productProposeFile
                  ? productProposeFile.substring(
                      productProposeFile.lastIndexOf('/') + 1,
                      productProposeFile.lastIndexOf('?'),
                    )
                  : '',
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

          {answered && (
            <Result
              status={accepted ? 'success' : 'error'}
              subTitle={
                accepted ? 'A proposta foi aceita' : 'A proposta não foi aceita'
              }
              extra={
                !isAdminCadist && (
                  <Button onClick={() => alterProductProposeAnswer()}>
                    Alterar resposta
                  </Button>
                )
              }
            />
          )}
          {productProposeFile !== '' && !isAdminCadist && !answered && (
            <AproveRecuseButtons>
              <h3>Você aceita essa proposta ?</h3>

              <div>
                <Button
                  type="primary"
                  onClick={() => productProposeAnswerModal(true)}
                >
                  Aceitar
                </Button>
                <Button
                  danger
                  type="primary"
                  onClick={() => productProposeAnswerModal(false)}
                >
                  Recusar
                </Button>
              </div>
            </AproveRecuseButtons>
          )}
        </Card>
      </ProductProposeContainer>
    </Spin>
  );
}
