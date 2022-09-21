import { PieChartOutlined } from '@ant-design/icons';
import { Menu as MenuAntd } from 'antd';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getApiClient } from '../../../clients/axios';
import { useAuth } from '../../../hooks/auth';

const { Item, SubMenu } = MenuAntd;

const services = [
  {
    name: 'Solicitações',
    route: 'solicitacoes',
  },
];

interface RequestsMenuProps {
  theme: 'light' | 'dark';
}

export default function RequestsMenu({
  theme,
}: RequestsMenuProps): JSX.Element {
  const { user } = useAuth();

  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productsRequestsAmount, setProductsRequestsAmount] = useState({});

  useEffect(() => {
    async function loadRequestsData() {
      const token = Cookies.get('ortoSetup.token');
      const apiClient = getApiClient(token);
      const productsResponse: ProductProps[] = await (
        await apiClient.get('/products')
      ).data;

      const { data: requestsResponse } = await apiClient.get('/requests');
      const amount = {};

      requestsResponse.forEach(request => {
        if (request.id !== '11TY57BI') {
          if (
            amount[request.productId] &&
            amount[request.productId][request.status]
          ) {
            amount[request.productId][request.status] += 1;
          } else if (amount[request.productId]) {
            amount[request.productId][request.status] = 1;
          } else {
            amount[request.productId] = {};
            amount[request.productId][request.status] = 1;
          }
        }
      });

      setProductsRequestsAmount(amount);

      productsResponse.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(productsResponse);
    }
    loadRequestsData();
  }, []);

  if (user.type === 'admin' || user.type === 'cadista') {
    return (
      <MenuAntd mode="vertical" theme={theme}>
        {services.map((service, index) => (
          <SubMenu
            key={index.toString()}
            title={service.name}
            icon={<PieChartOutlined />}
          >
            {products.map(product => (
              <SubMenu key={product.id} title={product.name}>
                <Item>
                  <Link href={`/services/${service.route}/${product.id}/novo`}>
                    {`Novos (${
                      productsRequestsAmount[product.id] &&
                      productsRequestsAmount[product.id].novo
                        ? productsRequestsAmount[product.id].novo
                        : '0'
                    })`}
                  </Link>
                </Item>
                <Item>
                  <Link
                    href={`/services/${service.route}/${product.id}/aguardando-aprovacao`}
                  >
                    {`Aguardando Aprovação (${
                      productsRequestsAmount[product.id] &&
                      productsRequestsAmount[product.id]['aguardando-aprovacao']
                        ? productsRequestsAmount[product.id][
                            'aguardando-aprovacao'
                          ]
                        : '0'
                    })`}
                  </Link>
                </Item>
                <Item>
                  <Link
                    href={`/services/${service.route}/${product.id}/em-andamento`}
                  >
                    {`Em Andamento (${
                      productsRequestsAmount[product.id] &&
                      productsRequestsAmount[product.id]['em-andamento']
                        ? productsRequestsAmount[product.id]['em-andamento']
                        : '0'
                    })`}
                  </Link>
                </Item>
                <Item>
                  <Link
                    href={`/services/${service.route}/${product.id}/finalizado`}
                  >
                    {`Finalizados (${
                      productsRequestsAmount[product.id] &&
                      productsRequestsAmount[product.id].finalizado
                        ? productsRequestsAmount[product.id].finalizado
                        : '0'
                    })`}
                  </Link>
                </Item>
                <Item>
                  <Link
                    href={`/services/${service.route}/${product.id}/cancelado`}
                  >
                    {`Cancelados (${
                      productsRequestsAmount[product.id] &&
                      productsRequestsAmount[product.id].cancelado
                        ? productsRequestsAmount[product.id].cancelado
                        : '0'
                    })`}
                  </Link>
                </Item>
              </SubMenu>
            ))}
          </SubMenu>
        ))}
      </MenuAntd>
    );
  }

  return (
    <MenuAntd mode="inline" theme={theme}>
      <SubMenu title="Solicitações" icon={<PieChartOutlined />}>
        <Item>
          <Link href="/services/solicitacoes/novo">Novo</Link>
        </Item>
        <Item>
          <Link href="/services/solicitacoes/aguardando-aprovacao">
            Aguardando aprovação
          </Link>
        </Item>
        <Item>
          <Link href="/services/solicitacoes/em-andamento">Em andamento</Link>
        </Item>
        <Item>
          <Link href="/services/solicitacoes/finalizado">Finalizado</Link>
        </Item>
        <Item>
          <Link href="/services/solicitacoes/cancelado">Cancelado</Link>
        </Item>
      </SubMenu>
    </MenuAntd>
  );
}
