/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';


import { accentColor } from '../constants/colors';

const ResetButton = styled.Text`
  font-weight: bold;
  color: ${accentColor}
`;
const FlatButton = ({
  outerStyle, fontSize, title, onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
  >
    <View style={{ ...{ padding: 0, justifyContent: 'center' }, ...outerStyle }}>
      <ResetButton
        style={{
        fontSize,
      }}
      >{title}
      </ResetButton>
    </View>
  </TouchableOpacity>
);

FlatButton.defaultProps = {
  outerStyle: {},
  title: 'Button',
  onPress: () => null,
  fontSize: 15,
};

FlatButton.propTypes = {
  outerStyle: PropTypes.object,
  title: PropTypes.string,
  onPress: PropTypes.func,
  fontSize: PropTypes.number,
};

export default FlatButton;
