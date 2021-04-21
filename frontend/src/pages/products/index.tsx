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
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import api from '../../clients/api';
import { useAuth } from '../../hooks/auth';

import { Content } from '../../styles/pages/products';

const { confirm } = Modal;

const Products: React.FC = () => {
  const { refreshToken, user } = useAuth();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productsDisplayed, setProductsDisplayed] = useState<ProductProps[]>(
    [],
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
        setProducts(productsUpdated);
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

  useEffect(() => {
    setLoading(true);
    api.get('/products').then(response => {
      setProducts(response.data);
      setProductsDisplayed(response.data);
      setLoading(false);
    });
  }, [refreshToken]);
  return (
    <>
      <PageHeader
        title="Escolha um produto abaixo"
        ghost={false}
        style={{ marginBottom: 20 }}
      >
        <Row align="middle" justify="center">
          <Col span={12}>
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
      <Card bordered={false}>
        <List
          size="large"
          loading={products.length === 0 ? loading : false}
          rowKey="id"
          itemLayout="vertical"
          dataSource={productsDisplayed}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={
                user.admin && [
                  <Button
                    type="primary"
                    onClick={() => push(`/requests/${item.id}`)}
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
