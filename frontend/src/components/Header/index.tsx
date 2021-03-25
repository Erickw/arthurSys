import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { PageHeader, Dropdown, Menu } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../../hooks/auth';

const Header: React.FC = () => {
  const { back } = useRouter();
  const { logout, user } = useAuth();

  const menuDropdown = (
    <Menu>
      <Menu.Item key="logout" onClick={() => logout()}>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <PageHeader
      onBack={back}
      extra={[
        <Dropdown
          key="dropdown"
          overlay={menuDropdown}
          placement="bottomCenter"
        >
          <span style={{ color: '#fff', cursor: 'pointer' }}>
            <UserOutlined style={{ marginRight: 5 }} />
            {user.name !== '' ? user.name : 'Usuário'}
          </span>
        </Dropdown>,
      ]}
      style={{ height: '100%' }}
    />
  );
};

export default Header;
