import styled from 'styled-components';

export const Content = styled.div`
  .description {
    max-width: 720px;
    line-height: 22px;
  }
  .extra {
    margin-top: 16px;
    line-height: 22px;

    span + span {
      margin-left: 10px;
    }
  }
`;
