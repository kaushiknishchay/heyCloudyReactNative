import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text } from 'react-native';


import { accentColor } from '../constants/colors';

const Wrapper = styled.View`
  flex: 1;
  padding: 20px
  justify-content: center;
  flex-direction: column;
`;

const LoadingPage = ({ text }) => (
  <Wrapper>
    <ActivityIndicator size="large" color={accentColor} />
    <Text
      style={{
          lineHeight: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: 10,
        }}
    >
      {text}
    </Text>
  </Wrapper>
);

LoadingPage.defaultProps = {
  text: 'Loading',
};

LoadingPage.propTypes = {
  text: PropTypes.string,
};

export default LoadingPage;
