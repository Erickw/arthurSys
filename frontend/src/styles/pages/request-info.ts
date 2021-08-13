import styled from 'styled-components';

export const RequestInfo = styled.div`
  .ant-descriptions-view {
    margin-bottom: 15px;
    white-space: break-spaces;

    .ant-descriptions-item-label {
      background-color: #dfdfdf;
      font-weight: 600;
    }
  }
`;

interface ProductProposeContainerProps {
  isClient: boolean;
}

export const ProductProposeContainer = styled.div<ProductProposeContainerProps>`
  .ant-upload.ant-upload-drag {
    display: ${({ isClient }) => isClient && 'none'};
  }

  .ant-upload-list-item-card-actions.picture {
    display: ${({ isClient }) => isClient && 'none'};
  }
`;

export const AproveRecuseButtons = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 2rem auto 2rem;

  h3 {
    margin: 1rem 0 2rem;
    text-align: center;
  }

  div {
    display: flex;
    justify-content: space-evenly;
  }
`;
