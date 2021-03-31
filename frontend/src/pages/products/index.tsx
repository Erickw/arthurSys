/* eslint-disable jsx-a11y/anchor-is-valid */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Card, List, Tag, Modal } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import api from '../../clients/api';
import { useAuth } from '../../hooks/auth';

import { Content } from '../../styles/pages/products';

const { confirm } = Modal;

const Products: React.FC = () => {
  const { refreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);

  function delteProductModal(product: ProductProps) {
    confirm({
      title: `Você tem certeza que deseja remover o produto ${product.name}`,
      icon: <ExclamationCircleOutlined />,
      content: 'Esse produto sera permanentemente removido do sistema.',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      async onOk() {
        await api.delete(`/products/${product.id}`);
        setProducts(
          products.filter(productItem => productItem.id !== product.id),
        );
      },
    });
  }

  useEffect(() => {
    setLoading(true);
    api.get('/products').then(response => setProducts(response.data));
    setLoading(false);
  }, [refreshToken]);
  return (
    <Card bordered={false}>
      <List
        size="large"
        loading={products.length === 0 ? loading : false}
        rowKey="id"
        itemLayout="vertical"
        dataSource={products}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[
              <Link href={`/edit-product/${item.id}`}>Editar</Link>,
              <a onClick={() => delteProductModal(item)}>Deletar</a>,
            ]}
          >
            <List.Item.Meta
              title={<Link href={`/requests/${item.id}`}>{item.name}</Link>}
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
  );
};

export default Products;
