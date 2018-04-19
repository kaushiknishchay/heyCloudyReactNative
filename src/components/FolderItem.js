import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';


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


const FolderItem = ({ item, onPress }) => {
  const WrapperComponent = item.count ? FolderWrap : FolderWrap2;
  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <WrapperComponent>
        <FolderText>{item.name ? item.name : item}</FolderText>
        {
        item.count &&
        <CountBadge>{item.count}</CountBadge>}
      </WrapperComponent>
    </TouchableOpacity>
  );
};

FolderItem.defaultProps = {
  onPress: () => null,
};

FolderItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onPress: PropTypes.func,
};

export default FolderItem;
