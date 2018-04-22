import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dimensions, Image, PixelRatio, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';

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
  padding: 20px;
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

const ImageItem = ({ data }) => {
  const screenWidth = Dimensions.get('screen').width - 20;
  let imageHeight;
  const node = data;
  const { image } = node;


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
    uri: node.image.uri,
    type: 'image/jpeg', // or photo.type
    name: 'testPhotoName',
  });
  console.log(data1);

  RNFS.readFile(node.image.uri, 'base64')
    .then(data11 => console.log(data11))
    .catch(err => console.log(err));

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
        source={{ uri: node.image.uri }}
        resizeMode="contain"
      />
      <ImageAlbumText>{node.group_name}</ImageAlbumText>
      <ImageAlbumText>{node.image.uri}</ImageAlbumText>
    </ImageWrap>
  );
};


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
