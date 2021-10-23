import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import {
  Card,
  Upload,
  Result,
  message,
  Spin,
  Button,
  Modal,
  Select,
} from 'antd';
import {
  AproveRecuseButtons,
  ProductProposeContainer,
} from '../../styles/pages/request-info';
import uploadFile from '../../utils/uploadFile';
import api from '../../clients/api';
import { useAuth } from '../../hooks/auth';

const { Option } = Select;
const { Dragger } = Upload;
const { confirm } = Modal;

interface ProductProposeParams {
  request: RequestProps;
  isAdminCadist: boolean;
  handleUploadProductProposeFile: (filesUrl: string[]) => void;
  handleRemoveProductPropose: (filesUrl: string[]) => void;
  handleAcceptProductPropose: (answer: boolean) => void;
  handleChangeProductProposeAnswer: () => void;
  handleProductProposeResponsible: (id: string, name: string) => void;
}

interface User {
  id: string;
  name: string;
  type: 'admin' | 'cadista' | 'cliente';
}

export default function ProductPropose({
  request,
  isAdminCadist,
  handleUploadProductProposeFile,
  handleRemoveProductPropose,
  handleAcceptProductPropose,
  handleChangeProductProposeAnswer,
  handleProductProposeResponsible,
}: ProductProposeParams): JSX.Element {
  const { user } = useAuth();

  const [productProposeFile, setProductProposeFile] = useState<string[]>(
    request.productPropose.files,
  );
  const [allAdmins, setAdmins] = useState<User[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [answered, setAnswered] = useState(request.productPropose.answered);
  const [accepted, setAccepted] = useState(request.productPropose.accepted);
  const [responsible, setResponsible] = useState(request.responsible.id);

  async function handleUploadFile(file) {
    try {
      setIsUploadingFile(true);

      const fileUrl = await uploadFile(file);
      const updatedProductProposeFiles = [...productProposeFile, fileUrl];

      setResponsible(user.id);

      setProductProposeFile(updatedProductProposeFiles);

      setIsUploadingFile(false);
      handleUploadProductProposeFile(updatedProductProposeFiles);
    } catch (err) {
      message.error(`${file.name} falha no envio do arquivo.`);
    }
  }

  async function handleRemoveFile(file) {
    if (file.status === 'removed') {
      const updatedProductProposeFiles = [...productProposeFile].filter(
        fileItem => fileItem !== file.url,
      );
      setProductProposeFile(updatedProductProposeFiles);
      handleRemoveProductPropose(updatedProductProposeFiles);
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

  function handleResponsible(id: string) {
    const adminSelected = allAdmins.find(admin => admin.id === id);
    handleProductProposeResponsible(adminSelected.id, adminSelected.name);
    setResponsible(id);
  }

  useEffect(() => {
    async function getAllUsers() {
      const { data: allUsers } = await api.get('/users');
      const adminUsers = allUsers.filter(
        userItem => userItem.type === 'admin' || userItem.type === 'cadista',
      );
      setAdmins(adminUsers);
    }
    getAllUsers();
  }, []);

  return (
    <Spin spinning={isUploadingFile} tip="Fazendo upload da prosposta.">
      <ProductProposeContainer isClient={!isAdminCadist}>
        <Card
          title="Proposta de Produto"
          style={{ marginTop: 24, minWidth: 450 }}
          bordered={false}
        >
          {!isAdminCadist && productProposeFile.length <= 0 && (
            <Result
              status="404"
              subTitle="Parece que ainda não foi feita uma proposta para essa requisição."
            />
          )}
          <Dragger
            name="file"
            listType="picture"
            showUploadList={productProposeFile.length > 0}
            fileList={productProposeFile.map(fileItem => ({
              uid: fileItem,
              name: fileItem
                ? fileItem.substring(
                    fileItem.lastIndexOf('/') + 1,
                    fileItem.lastIndexOf('?'),
                  )
                : '',
              url: fileItem,
              thumbUrl: fileItem,
              size: 10,
              type: 'file',
            }))}
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
          {productProposeFile.length > 0 && (
            <Select
              style={{ width: '100%', marginTop: '1rem' }}
              placeholder="Escolha um responsável"
              optionFilterProp="children"
              value={responsible}
              onSelect={value => handleResponsible(value.toString())}
            >
              {allAdmins.map(adminUser => (
                <Option key={adminUser.id} value={adminUser.id}>
                  {adminUser.name}
                </Option>
              ))}
            </Select>
          )}
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
          {productProposeFile.length > 0 && !isAdminCadist && !answered && (
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
