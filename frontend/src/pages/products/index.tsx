/* eslint-disable jsx-a11y/anchor-is-valid */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Card,
  List,
  Tag,
  Modal,
  PageHeader,
  Input,
  Button,
  Row,
  Col,
} from 'antd';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import api from '../../clients/api';
import { getApiClient } from '../../clients/axios';
import { useAuth } from '../../hooks/auth';

import { Content } from '../../styles/pages/products';

const { confirm } = Modal;

interface ProductsProps {
  products: ProductProps[];
}

const Products: React.FC<ProductsProps> = ({ products }: ProductsProps) => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [productsDisplayed, setProductsDisplayed] = useState<ProductProps[]>(
    products,
  );

  function deleteProductModal(product: ProductProps) {
    confirm({
      title: `Você tem certeza que deseja remover o produto ${product.name}`,
      icon: <ExclamationCircleOutlined />,
      content: 'Esse produto sera permanentemente removido do sistema.',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      async onOk() {
        await api.delete(`/products/${product.id}`);
        const productsUpdated = products.filter(
          productItem => productItem.id !== product.id,
        );
        // setProducts(productsUpdated);
        setProductsDisplayed(productsUpdated);
      },
    });
  }

  function handleSearch(value: string) {
    const productsSearched = [...products];
    const test = productsSearched.filter(product =>
      product.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
    );
    setProductsDisplayed(test);
  }

  return (
    <>
      <PageHeader
        title="Escolha um produto abaixo"
        ghost={false}
        style={{ marginBottom: 20, minWidth: 450 }}
      >
        <Row align="middle" justify="center">
          <Col xxl={12} xl={14} lg={16} md={18} sm={22} xs={22}>
            <Input.Search
              enterButton
              allowClear
              size="large"
              placeholder="Procure por um produto"
              onChange={e => handleSearch(e.target.value)}
            />
          </Col>
        </Row>
      </PageHeader>
      <Card bordered={false} style={{ minWidth: 450 }}>
        <List
          size="large"
          rowKey="id"
          itemLayout="vertical"
          dataSource={productsDisplayed}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={
                user.type === 'admin'
                  ? [
                      <Button
                        type="primary"
                        onClick={() => push(`/requests/${item.id}`)}
                        disabled={!item.available}
                      >
                        Solicitar Agora
                      </Button>,
                      <Button onClick={() => push(`/edit-product/${item.id}`)}>
                        Editar
                      </Button>,
                      <Button
                        type="primary"
                        danger
                        onClick={() => deleteProductModal(item)}
                      >
                        Deletar
                      </Button>,
                    ]
                  : [
                      <Button
                        type="primary"
                        onClick={() => push(`/requests/${item.id}`)}
                        disabled={!item.available}
                      >
                        Solicitar Agora
                      </Button>,
                    ]
              }
            >
              <List.Item.Meta
                title={item.name}
                description={
                  <span>
                    <Tag color={item.available ? 'blue' : 'red'}>
                      {item.available ? 'Disponível' : 'Indisponível'}
                    </Tag>
                  </span>
                }
              />
              <Content>
                <div className="description">{item.description}</div>
                <div className="extra">
                  <span>{`Valor: ${new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(item.value)}`}</span>
                  <span>{`Pagamento: ${item.requiredPayment}`}</span>
                </div>
              </Content>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default Products;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { 'ortoSetup.token': token } = req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const apiCLient = getApiClient(token);

  const response = await apiCLient.get('/products');
  const products = response.data.sort((a, b) => a.name.localeCompare(b.name));
  return {
    props: { products },
  };
};
