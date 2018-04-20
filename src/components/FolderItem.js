import React from 'react';
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
  flex: 8;
  width: 40px;
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


class FolderItem extends React.Component {
  showBadge = (item) => {
    if (item.count !== undefined && item.count !== null && item.count > 0) {
      return (<CountBadge>{item.count}</CountBadge>);
    }
    return null;
  };

  render() {
    const { item, onPress, touchable } = this.props;
    const WrapperComponent = !touchable ? FolderWrap : FolderWrap2;
    if (touchable) {
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.5}
        >
          <WrapperComponent>
            <FolderText>{item.name ? item.name : item}</FolderText>
            {this.showBadge(item)}
          </WrapperComponent>
        </TouchableOpacity>
      );
    }
    return (
      <WrapperComponent>
        <FolderText>{item.name ? item.name : item}</FolderText>
        {this.showBadge(item)}
      </WrapperComponent>
    );
  }
}

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
