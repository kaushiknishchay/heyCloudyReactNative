/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import { accentColor } from '../constants/colors';


const Wrapper = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px;
  flex: 1;
  background: #eee;
  padding: 20px 15px;
`;

const Heading = styled.Text`
  font-size: 22px;
  margin: 10px 0 20px 0;
  font-weight: normal;
  color: #333;  
`;


const BlankInfo = ({
  heading, icon, iconColor, iconClass, ...props
}) => {
  const IconWrapper = iconClass || Ionicons;

  return (
    <Wrapper>
      <IconWrapper
        name={icon || 'ios-alert-outline'}
        size={90}
        color={iconColor}
      />
      <Heading>{heading}</Heading>
      {
        props.children
      }
    </Wrapper>
  );
};

BlankInfo.defaultProps = {
  children: null,
  icon: 'ios-alert-outline',
  iconColor: accentColor,
  iconClass: Ionicons,
  heading: 'Error',
};
BlankInfo.propTypes = {
  children: PropTypes.any,
  heading: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  iconClass: PropTypes.func,
};
export default BlankInfo;
