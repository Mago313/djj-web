import React from 'react';
import styled from 'styled-components';

type TProps = {
  children: React.ReactChild;
  paddingTop?: string;
};

const SpacingContainer = styled.div<TProps>`
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '16px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
`;

export const Spacing: React.FC<TProps> = ({ children, paddingTop }) => {
  return <SpacingContainer style={{ paddingTop }} children={children} />;
};
