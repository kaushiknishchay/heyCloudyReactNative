import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TouchableHighlight, TouchableOpacity } from 'react-native';
import { headerColor, listItemSelectColor } from '../constants/colors';


const FolderWrap = styled.View`
  padding: 8px 0;
  margin-bottom: 5px;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: row;
`;

const FolderWrap2 = styled.View`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: #fff;
`;

const FolderText = styled.Text`
  font-size: 16px;
  flex: 90;
`;
const CountBadge = styled.Text`
  flex: 5;
  width: 20px;
  font-size: 14px;
  line-height: 24px;
  color: #fff;
  margin: 0 auto;
  text-align: center;
  background: #007bff;
  padding-right: 6px;
  padding-left: 6px;
  border-radius: 10px;
`;


const FolderItem = ({ item, onPress, touchable }) => {
  const WrapperComponent = item.count ? FolderWrap : FolderWrap2;
  if (touchable) {
    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor={listItemSelectColor}
      >
        <WrapperComponent>
          <FolderText>{item.name ? item.name : item}</FolderText>
          {
            item.count &&
            <CountBadge>{item.count}</CountBadge>}
        </WrapperComponent>
      </TouchableHighlight>
    );
  }
  return (
    <WrapperComponent>
      <FolderText>{item.name ? item.name : item}</FolderText>
      {
        item.count &&
        <CountBadge>{item.count}</CountBadge>
      }
    </WrapperComponent>
  );
};

FolderItem.defaultProps = {
  onPress: () => null,
  touchable: false,
};

FolderItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onPress: PropTypes.func,
  touchable: PropTypes.bool,
};

export default FolderItem;
