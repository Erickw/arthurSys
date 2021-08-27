import { HomeTwoTone, PhoneTwoTone, UserOutlined } from '@ant-design/icons';
import { Modal, Tag } from 'antd';
import React from 'react';

import {
  Container,
  Title,
  Content,
  Info,
} from '../../../styles/components/displayUserInfoModal';
import { capitalizeFirstLetter, getTypeUserColor } from '../../../utils/utils';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: 'admin' | 'cadista' | 'cliente';
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  number: string;
  contactNumber: string;
}

interface DisplayUserInfoModalProps {
  modalVisible: boolean;
  close: () => void;
  // eslint-disable-next-line react/require-default-props
  user: User;
}

export default function DisplayUserInfoModal({
  modalVisible,
  close,
  user,
}: DisplayUserInfoModalProps): JSX.Element {
  return (
    <Modal
      destroyOnClose
      title="Informações do Usuário"
      visible={modalVisible}
      onCancel={() => close()}
      footer={false}
      width={560}
    >
      <Container>
        <Content>
          <h3>
            <UserOutlined style={{ color: '#1890ff' }} />
            Dados
          </h3>

          <Title>
            <div>
              <span>Nome: </span>
              <span>{user.name !== '' ? user.name : 'Não informado'}</span>
            </div>

            <div>
              <span>Email: </span>
              <span>{user.email !== '' ? user.email : 'Não informado'}</span>
            </div>

            <div>
              <span>Tipo: </span>
              <Tag color={getTypeUserColor(user.type)}>
                {capitalizeFirstLetter(user.type)}
              </Tag>
            </div>
          </Title>

          <h3>
            <HomeTwoTone />
            Endereço
          </h3>

          <Info>
            <div>
              <span>Estado: </span>
              <span>{user.state !== '' ? user.state : 'Não informado'}</span>
            </div>

            <div>
              <span>Cidade: </span>
              <span>{user.city !== '' ? user.city : 'Não informado'}</span>
            </div>

            <div>
              <span>CEP: </span>
              <span>
                {user.zipCode !== '' ? user.zipCode : 'Não informado'}
              </span>
            </div>

            <div>
              <span>Bairro: </span>
              <span>
                {user.neighborhood !== '' ? user.neighborhood : 'Não informado'}
              </span>
            </div>
          </Info>

          <Info style={{ marginTop: '0.5rem' }}>
            <div>
              <span>Rua: </span>
              <span>{user.street !== '' ? user.street : 'Não informado'}</span>
            </div>

            <div>
              <span>Número: </span>
              <span>{user.number !== '' ? user.number : 'Não informado'}</span>
            </div>
          </Info>

          <h3>
            <PhoneTwoTone />
            Contato
          </h3>
          <Info>
            <div>
              <span>Número: </span>
              <span>
                {user.contactNumber !== ''
                  ? user.contactNumber
                  : 'Não informado'}
              </span>
            </div>
          </Info>
        </Content>
      </Container>
    </Modal>
  );
}
