import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: column;

  div:not(:first-child) {
    margin-top: 0.5rem;
  }

  span:first-child {
    font-weight: 600;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700;

  h3 {
    span {
      margin-right: 0.6rem;
    }
  }

  h3:not(:first-child) {
    margin-top: 2rem;
  }
`;

export const Info = styled.div`
  display: flex;

  div {
    margin-right: 2rem;

    span:first-child {
      font-weight: 600;
    }
  }
`;
