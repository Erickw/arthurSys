import styled from 'styled-components';

export const InputGroupWrapper = styled.div`
  .ant-form-item {
    margin-bottom: 14px;
  }

  .ant-input.ant-input-disabled {
    color: unset !important;
  }

  .ant-select-disabled {
    .ant-select-selector {
      color: unset !important;
    }
  }
`;

export const SettingsButtons = styled.div`
  display: flex;
  justify-content: space-evenly;

  button {
    width: 12rem;
  }
`;
