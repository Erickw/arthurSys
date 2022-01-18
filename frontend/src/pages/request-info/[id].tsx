import { Card, Descriptions, message, PageHeader } from 'antd';
import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { convertSnakeCaseToNormal } from '../../utils/utils';
import Comments from '../../components/RequestInfo/Comments';

import { RequestInfo as RequestDisplay } from '../../styles/pages/request-info';
import ProductPropose from '../../components/RequestInfo/ProductPropose';
import { getApiClient } from '../../clients/axios';
import api from '../../clients/api';
import AditionalFiles from '../../components/RequestInfo/AditionalFiles';
import { useAuth } from '../../hooks/auth';

interface CommentProps {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

interface RequestInfoParams {
  product: ProductProps;
  request: RequestProps;
  comments: CommentProps[];
  isAdminCadist: boolean;
}

export default function RequestInfo({
  product,
  request,
  comments,
  isAdminCadist,
}: RequestInfoParams): JSX.Element {
  const { back } = useRouter();
  const { user } = useAuth();

  function displayCorrectFormatData(item) {
    const data = item;
    if (Array.isArray(data)) {
      const test = data.map(file => {
        if (file.slice(0, 38) === 'https://firebasestorage.googleapis.com') {
          const fileName = file.substring(
            file.lastIndexOf('/') + 1,
            file.lastIndexOf('?'),
          );
          return (
            <div key={file}>
              <a href={file} target="_blank" rel="noreferrer">
                {fileName}
              </a>
              <br />
            </div>
          );
        }
        return <></>;
      });

      return test;
    }

    if (!Array.isArray(data) && data.substr(data.length - 1) === 'Z') {
      // verify if data pass is a date, if is a date return in date format
      try {
        const dateString = new Intl.DateTimeFormat('pt-br').format(
          new Date(data),
        );
        return dateString;
      } catch (err) {
        return data;
      }
    }

    return data;
  }

  async function handleUploadProductProposeFile(filesUrl: string[]) {
    const requestToUpdate = request;
    requestToUpdate.productPropose.files = filesUrl;

    if (requestToUpdate.status !== 'finalizado') {
      requestToUpdate.status = 'aguardando-aprovacao';
    }

    requestToUpdate.responsible = {
      id: user.id,
      name: user.name,
    };

    await api.put(`/requests/${request.id}`, requestToUpdate);
    message.success(`Proposta da requisição enviada com sucesso!`);
  }

  async function handleRemoveProductProposeFile(filesUrl: string[]) {
    const requestToUpdate = request;
    requestToUpdate.productPropose.files = filesUrl;

    if (filesUrl.length === 0) {
      requestToUpdate.responsible = undefined;
    }

    await api.put(`/requests/${request.id}`, requestToUpdate);
    message.success(`Proposta da requisição foi removida.`);
  }

  async function handleAcceptProductPropose(answer: boolean) {
    const requestToUpdate = request;
    requestToUpdate.productPropose.answered = true;
    requestToUpdate.productPropose.accepted = answer;
    if (answer) {
      requestToUpdate.status = 'finalizado';
    } else {
      requestToUpdate.status = 'em-andamento';
    }

    await api.put(`/requests/${request.id}`, requestToUpdate);
  }

  async function handleChangeProductProposeAnswer() {
    const requestToUpdate = request;
    requestToUpdate.productPropose.answered = false;
    requestToUpdate.productPropose.accepted = false;
    requestToUpdate.status = 'aguardando-aprovacao';

    await api.put(`/requests/${request.id}`, requestToUpdate);
  }

  async function handleUploadAditionalFile(files) {
    const requestToUpdate = request;
    requestToUpdate.additionalFields = files;

    await api.put(`/requests/${request.id}`, requestToUpdate);
  }

  async function handleProductProposeResponsible(id: string, name: string) {
    const requestToUpdate = request;
    requestToUpdate.responsible = {
      id,
      name,
    };

    await api.put(`/requests/${request.id}`, requestToUpdate);
  }

  async function handleAddComment(
    commentData: Omit<CommentProps, 'id'>,
  ): Promise<void> {
    const updateRequest = request;
    if (isAdminCadist) {
      updateRequest.hasNewCommentAdmin = true;
    } else {
      updateRequest.hasNewCommentUser = true;
    }

    updateRequest.status = 'em-andamento';

    await api.put(`/requests/${request.id}`, updateRequest);
    await api.post(`/comments/request/${request.id}`, commentData);
  }

  return (
    <>
      <PageHeader
        title={`Requisição ${request.id}`}
        ghost={false}
        subTitle={product.name}
        onBack={() => back()}
        style={{ marginBottom: 24, minWidth: 450 }}
      />
      <RequestDisplay>
        <Card bordered={false} style={{ minWidth: 450 }}>
          {product && (
            <Descriptions
              title="Produto"
              layout="vertical"
              bordered
              column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Nome do produto">
                {product.name}
              </Descriptions.Item>
              <Descriptions.Item label="Valor">
                {product.value}
              </Descriptions.Item>
              <Descriptions.Item label="Pagamento">
                {product.requiredPayment}
              </Descriptions.Item>
              <Descriptions.Item label="Disponibilidade">
                {product.available ? 'Disponível' : 'Indisponível'}
              </Descriptions.Item>
              <Descriptions.Item span={4} label="Descrição">
                {product.description}
              </Descriptions.Item>
              <Descriptions.Item span={4} label="Nota">
                {product.notes}
              </Descriptions.Item>
            </Descriptions>
          )}

          <Descriptions
            title="Endereço"
            layout="vertical"
            bordered
            column={{ xxl: 12, xl: 8, lg: 5, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Estado">
              {request.address.state}
            </Descriptions.Item>
            <Descriptions.Item label="Cidade">
              {request.address.city}
            </Descriptions.Item>
            <Descriptions.Item label="CEP">
              {request.address.postalCode}
            </Descriptions.Item>
            <Descriptions.Item label="Bairro">
              {request.address.district}
            </Descriptions.Item>
            <Descriptions.Item label="Rua">
              {request.address.street}
            </Descriptions.Item>
            <Descriptions.Item label="Número">
              {request.address.number}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Requisção"
            layout="vertical"
            bordered
            column={{ xxl: 12, xl: 8, lg: 5, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Nome do paciente">
              {request.patientName}
            </Descriptions.Item>
            <Descriptions.Item label="Email do paciente">
              {request.patientEmail}
            </Descriptions.Item>
            <Descriptions.Item label="Produto">
              {request.productId}
            </Descriptions.Item>
            <Descriptions.Item label="Data">
              {new Intl.DateTimeFormat('pt-br').format(new Date(request.date))}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Informações adicionais do produto"
            layout="vertical"
            bordered
            column={{ xxl: 5, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            {request.fieldsValues !== '' &&
              request.fieldsValues.map(fieldValue =>
                Object.entries(fieldValue.fields).map(item => (
                  <Descriptions.Item label={convertSnakeCaseToNormal(item[0])}>
                    {displayCorrectFormatData(item[1])}
                  </Descriptions.Item>
                )),
              )}
          </Descriptions>
        </Card>
      </RequestDisplay>

      <AditionalFiles
        aditionalFiles={
          // eslint-disable-next-line no-nested-ternary
          request.additionalFields === ''
            ? []
            : Array.isArray(request.additionalFields)
            ? request.additionalFields
            : [request.additionalFields]
        }
        handleUploadAditionalFile={files => handleUploadAditionalFile(files)}
      />
      <ProductPropose
        request={request}
        isAdminCadist={isAdminCadist}
        handleUploadProductProposeFile={fileUrl =>
          handleUploadProductProposeFile(fileUrl)
        }
        handleRemoveProductPropose={filesUrl =>
          handleRemoveProductProposeFile(filesUrl)
        }
        handleAcceptProductPropose={answer =>
          handleAcceptProductPropose(answer)
        }
        handleChangeProductProposeAnswer={() =>
          handleChangeProductProposeAnswer()
        }
        handleProductProposeResponsible={(id, name) =>
          handleProductProposeResponsible(id, name)
        }
      />

      <Comments
        comments={comments}
        requestId={request.id}
        handleAddComment={commentData => handleAddComment(commentData)}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query: { id },
}) => {
  const { 'ortoSetup.token': token } = req.cookies;
  const { 'ortoSetup.user': userJSON } = req.cookies;
  const user = JSON.parse(userJSON);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const apiCLient = getApiClient(token);

  const responseRequest = await apiCLient.get('/requests');
  const request: RequestProps = responseRequest.data.find(
    requestFromApi => requestFromApi.id === id,
  );

  const responseProduct = await apiCLient.get(`products/${request.productId}`);
  const product = responseProduct.data;

  const { data: comments } = await apiCLient.get(`/comments/request/${id}`);

  const commentsSorted = comments
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const isAdminCadist = user.type === 'admin' || user.type === 'cadista';

  if (!!request.hasNewCommentAdmin && !isAdminCadist) {
    const updateRequest = { ...request };
    updateRequest.hasNewCommentAdmin = false;

    await apiCLient.put(`/requests/${request.id}`, updateRequest);
  }

  if (!!request.hasNewCommentUser && isAdminCadist) {
    const updateRequest = { ...request };
    updateRequest.hasNewCommentUser = false;
    await apiCLient.put(`/requests/${request.id}`, updateRequest);
  }

  return {
    props: {
      request,
      product,
      comments: commentsSorted,
      isAdminCadist,
    },
  };
};
