/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Space,
  Table,
  Tag,
} from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../../clients/api';
import CreateUserModal from './components/CreateUserModal';

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

  async function handleCloseCreateUserModal() {
    setCreateUserModalVisible(false);
    const usersFromApi = await api.get('/users');
    const updateStateUsers = usersFromApi.data;
    setStateUsers(updateStateUsers);
  }

  const handleSearch = tableConfirm => {
    tableConfirm();
  };

  const handleReset = clearFilters => {
    clearFilters();
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => 100);
      }
    },
  });

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
