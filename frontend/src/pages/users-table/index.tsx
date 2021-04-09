/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Card, Descriptions, Modal, Space, Table, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../clients/api';

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

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Admin',
      dataIndex: 'admin',
      key: 'admin',
      render: record => (
        <span>
          <Tag color={record ? 'blue' : 'green'}>
            {record ? 'Admin' : 'Comum'}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => deleteRequestModal(record)}>Deletar</a>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered>
      <Descriptions title="Tabela de usuários" />

      <Table columns={columns} dataSource={stateUsers} />
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
