import React, { Component } from 'react';
import { Alert, CameraRoll, FlatList, StyleSheet, View } from 'react-native';
import ImageItem from './ImageItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  flatList: {
    marginLeft: 'auto',
    width: '100%',
    marginRight: 'auto',
  },
});

class GalleryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoList: [],
    };
  }


  componentDidMount() {
    CameraRoll.getPhotos({
      first: 10,
    }).then(res => res.edges)
      .then((edges) => {
        this.setState({
          photoList: edges,
        });
      }).catch((err) => {
        Alert.alert('Error', JSON.stringify(err));
      });
  }

  keyExtractor= item => item.node.image.uri;

  renderListItem = ({ item }) => (<ImageItem data={item.node} />);

  render() {
    const { photoList } = this.state;

    return (
      <View style={styles.container}>

        {
          photoList.length > 0 &&
          <FlatList
            data={photoList}
            style={styles.flatList}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderListItem}
          />
        }
      </View>
    );
  }
}

GalleryScreen.propTypes = {};

export default GalleryScreen;
