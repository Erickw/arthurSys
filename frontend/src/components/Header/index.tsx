import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { PageHeader, Dropdown, Menu, Switch } from 'antd';
import React from 'react';
import { useAuth } from '../../hooks/auth';

interface HeaderProps {
  theme: 'dark' | 'light';
  handleChangeTheme: (theme: 'dark' | 'light') => void;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  handleChangeTheme,
}: HeaderProps) => {
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
      extra={[
        <Switch
          checked={theme === 'dark'}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          onChange={() =>
            handleChangeTheme(theme === 'dark' ? 'light' : 'dark')
          }
        />,
        <Dropdown
          key="dropdown"
          overlay={menuDropdown}
          placement="bottomCenter"
        >
          <span
            style={{
              cursor: 'pointer',
              color: theme === 'dark' ? '#fff' : '#001529',
              margin: 'auto 50px',
            }}
          >
            <UserOutlined style={{ marginRight: 5 }} />
            {user.name !== '' ? user.name : 'Usuário'}
          </span>
        </Dropdown>,
      ]}
      style={{
        minWidth: 470,
        background: theme === 'dark' ? '#001529' : '#fff',
      }}
    />
  );
};

export default Header;
