import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { accentColor } from '../constants/colors';


const FolderWrap = styled.View`
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


class FolderCheckBoxItem extends React.Component {
  showBadge = (item) => {
    if (item.count !== undefined && item.count !== null && item.count > 0) {
      return (<CountBadge>{item.count}</CountBadge>);
    }
    return null;
  };

  render() {
    const { item, onPress } = this.props;

    const iconType = item.backedUp ? 'check-box' : 'check-box-outline-blank';

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
      >
        <FolderWrap>
          <FolderText>{item.name ? item.name : item}</FolderText>
          <MaterialIcons
            name={iconType}
            size={28}
            color={accentColor}
          />
        </FolderWrap>
      </TouchableOpacity>
    );
  }
}

FolderCheckBoxItem.defaultProps = {
  onPress: () => null,
};

FolderCheckBoxItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onPress: PropTypes.func,
};

export default FolderCheckBoxItem;
