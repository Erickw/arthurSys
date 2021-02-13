import React from 'react';
import { Layout as LayoutAntd } from 'antd';
import Menu from './Menu';


const { Sider, Header, Content, Footer } = LayoutAntd

const Layout: React.FC = ({ children }) => {

	// if(false) {
	// 	return <>{children}</>
	// }

	return (
		<LayoutAntd>
			<Sider>
				<Menu />
			</Sider>
			<Layout>
				<Header>Header</Header>
				<Content style={{ minHeight: "calc(100vh - 134px)", padding: "24px 48px" }}>
					{children}
				</Content>
				<Footer style={{ textAlign: "center" }}>
					Copyright © Litesense 2021
				</Footer>
			</Layout>
		</LayoutAntd>
	)
}

export default Layout;