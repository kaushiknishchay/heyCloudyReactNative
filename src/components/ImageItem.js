/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dimensions, Image, StyleSheet } from 'react-native';
import fileUtil from '../utils/file';
import { SubText, TitleText } from './SimpleComponents';


const ImageWrap = styled.View`
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 20px;
  elevation: 4;
  background-color: #eee;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const ImageAlbumTextWrap = styled.View`
  background: #fff;
  margin: 0px;
  flex-direction: column;
  padding: 15px 20px;
  border-radius: 2px;
`;

const ImageText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;


const styles = StyleSheet.create({
  imageStyle: {
    padding: 0,
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

class ImageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: {},
      albumName: '',
      timestamp: '',
      fileType: '',
    };
  }


  componentDidMount() {
    const { data } = this.props;
    if (data !== undefined && data.image !== undefined) {
      fileUtil.getFileStat(data.image.uri)
        .then(stats => this.setState({
          imageData: stats,
          albumName: data.group_name,
          timestamp: data.timestamp,
          fileType: data.type,
        }));
    }
  }


  render() {
    const { data } = this.props;
    const { image } = data;
    const { imageData, albumName } = this.state;

    const screenWidth = Dimensions.get('screen').width - 20;
    let imageHeight;

    const maxOf = Math.max(image.width, image.height);
    const minOf = Math.min(image.width, image.height);
    const imageWidth = screenWidth;

    // Portrait Image
    if (image.width > image.height) {
      imageHeight = Math.min((imageWidth / maxOf) * minOf, 300);
    } else {
    // Landscape Image
      imageHeight = Math.min((imageWidth / minOf) * maxOf * 0.6, 300);
    }

    const data1 = new FormData();
    data1.append('name', 'testName'); // you can append anyone.
    data1.append('photo', {
      uri: image.uri,
      type: 'image/jpeg', // or photo.type
      name: 'testPhotoName',
    });

    return (
      <ImageWrap
        style={{
          elevation: 2,
        }}
      >
        <Image
          style={[styles.imageStyle, {
            width: imageWidth,
            height: imageHeight,
          }]}
          source={{ uri: image.uri }}
          resizeMode="contain"
        />
        <ImageAlbumTextWrap>
          <TitleText>{albumName}</TitleText>
          <SubText>{imageData.filename}</SubText>
        </ImageAlbumTextWrap>
      </ImageWrap>
    );
  }
}


ImageItem.propTypes = {
  data: PropTypes.shape({
    timestamp: PropTypes.number,
    group_name: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number,
      uri: PropTypes.string,
    }),
  }).isRequired,
};
export default ImageItem;
