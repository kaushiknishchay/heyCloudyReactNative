/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dimensions, Image, StyleSheet } from 'react-native';
import fileUtil from '../utils/file';


const ImageWrap = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 20px;
  z-index: 4;
  background-color: #eee;
  border-radius: 5px;
  border: 1px solid #ddd;
`;
const ImageAlbumText = styled.Text`
  background: #fff;
  margin: 0px;
  padding: 15px 20px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 2px;
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

    const maxOf = image.width > image.height ? image.width : image.height;
    const minOf = image.width < image.height ? image.width : image.height;
    const imageWidth = screenWidth;

    if (image.width > image.height) {
      imageHeight = (imageWidth / maxOf) * minOf;
    } else {
      imageHeight = (imageWidth / minOf) * maxOf * 0.8;
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
        <ImageAlbumText>{imageData.filename} ({albumName})</ImageAlbumText>
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
