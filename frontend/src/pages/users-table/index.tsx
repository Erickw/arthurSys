/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Button, Card, Descriptions, Modal, Space, Table, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../clients/api';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import { getColumnSearchProps } from '../../components/ColumnSearch';

interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
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
  const [userToEdit, setUserToEdit] = useState<User>(undefined);

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

  const columns = [
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
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Admin',
      dataIndex: 'admin',
      key: 'admin',
      // eslint-disable-next-line no-nested-ternary
      sorter: (a, b) => (a.admin === b.admin ? 0 : a.admin ? -1 : 1),
      render: record => (
        <span>
          <Tag color={record ? 'blue' : 'green'}>
            {record ? 'Admin' : 'Comum'}
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
    <Card bordered>
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

UsersTable.getInitialProps = async () => {
  const usersFromApi = await api.get('/users');
  const users = usersFromApi.data;
  return {
    users,
  };
};
