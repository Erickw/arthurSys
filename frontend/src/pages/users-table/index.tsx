/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Button, Card, Descriptions, Modal, Space, Table, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import { GetServerSideProps } from 'next';
import api from '../../clients/api';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import { getColumnSearchProps } from '../../components/ColumnSearch';
import { getApiClient } from '../../clients/axios';

interface User {
  id: string;
  name: string;
  password: string;
  email: string;
  type: 'admin' | 'cadist' | 'client';
  state: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  number: string;
  contactNumber: string;
}

interface UsersTableProps {
  users: User[];
}

const { confirm } = Modal;

export default function UsersTable({ users }: UsersTableProps): JSX.Element {
  const [stateUsers, setStateUsers] = useState<User[]>(
    users.map(user => ({ ...user, key: user.id })),
  );

  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User>();

  function deleteRequestModal(user: User) {
    confirm({
      title: `Você tem certeza que deseja remover o usuário ${user.name}`,
      icon: <ExclamationCircleOutlined />,
      content: 'Esse usuário será permanentemente removido do sistema.',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      async onOk() {
        await api.delete(`/users/${user.id}`);
        setStateUsers(
          stateUsers.filter(userFilter => userFilter.id !== user.id),
        );
      },
    });
  }

  function handleEditUser(user: User) {
    setUserToEdit(user);
    setEditUserModalVisible(true);
  }

  async function handleCloseCreateUserModal() {
    setCreateUserModalVisible(false);
    const usersFromApi = await api.get('/users');
    const updateStateUsers = usersFromApi.data;
    setStateUsers(updateStateUsers.map(user => ({ ...user, key: user.id })));
  }

  async function handleCloseEditUserModal() {
    setEditUserModalVisible(false);
    const usersFromApi = await api.get('/users');
    const updateStateUsers = usersFromApi.data;
    setStateUsers(updateStateUsers.map(user => ({ ...user, key: user.id })));
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg'],
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      responsive: ['md'],
      // eslint-disable-next-line no-nested-ternary
      sorter: (a, b) => (a.type === b.type ? 0 : a.type ? -1 : 1),
      render: record => (
        <span>
          <Tag color={record === 'admin' ? 'blue' : 'green'}>
            {record === 'admin' ? 'Admin' : 'Comum'}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Opções',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => handleEditUser(record)}>Editar</a>
          <a onClick={() => deleteRequestModal(record)}>Deletar</a>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered style={{ minWidth: 450 }}>
      <Descriptions title="Tabela de usuários">
        <Descriptions.Item style={{ float: 'right' }}>
          <Button
            type="primary"
            onClick={() => setCreateUserModalVisible(true)}
          >
            Adicionar usuário
          </Button>
        </Descriptions.Item>
      </Descriptions>

      <CreateUserModal
        close={() => handleCloseCreateUserModal()}
        modalVisible={createUserModalVisible}
      />

      {userToEdit && (
        <EditUserModal
          close={() => handleCloseEditUserModal()}
          modalVisible={editUserModalVisible}
          user={userToEdit}
        />
      )}

      <Table
        columns={columns}
        dataSource={stateUsers}
        showSorterTooltip={{ title: 'Clique para ordernar o tipo de usuário' }}
      />
    </Card>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { 'ortoSetup.token': token, 'ortoSetup.user': userJson } = req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = JSON.parse(userJson);

  if (user.type === 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const apiCLient = getApiClient(token);

  const usersFromApi = await apiCLient.get('/users');
  const users = usersFromApi.data;

  return {
    props: { users },
  };
};
