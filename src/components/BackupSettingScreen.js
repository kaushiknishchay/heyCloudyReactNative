import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, CameraRoll, FlatList, Text } from 'react-native';
import styled from 'styled-components';


import FolderItem from './FolderItem';
import { backupFoldersKey } from '../constants/storageKeys';
import { accentColor, appBackground } from '../constants/colors';
import realm from '../database/realm';

const BackupScreen = styled.View`
  padding: 10px;
  background: ${appBackground};
  flex: 1;
  flex-direction: column;
`;

const ButtonGroup = styled.View`
  padding: 10px;
  margin: 10px;
  flex-direction: row;
  align-items: stretch;
  align-content: center;
  justify-content: space-around;
`;

const Button = styled.Button`
  padding: 200px;
  flex: 3;
`;

const SectionHeader = styled.Text`
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 0.51px;
  padding: 10px;
  background: #ddd;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  color: #000;
`;


class BackupSettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      deviceAllFolders: [],
    };
  }


  componentDidMount() {
    try {
      const allFoldersList = this.getAllFoldersRealm();
      if (allFoldersList.length > 0) {
        const allFolders = allFoldersList[0].getFolderList();
        if (allFolders !== undefined && allFolders !== null && allFolders.length > 0) {
          this.setFoldersInState(allFolders);
        }
      } else {
        this.computeFolderList();
      }
    } catch (error) {
      this.computeFolderList();
    }
  }

  getAllPhotosRealm = () => realm.objects('AllPhotos');
  getAllFoldersRealm = () => realm.objects('AllFoldersList');


  setFoldersInState = (allFolders) => {
    this.setState({
      isLoading: false,
      deviceAllFolders: allFolders,
    });
  };

  computeFolderList = () => {
    try {
      this.setState({
        isLoading: true,
      });

      CameraRoll.getPhotos({
        first: 9999,
      }).then(res => res.edges)
        .then((edges) => {
          realm.write(() => {
            if (this.getAllPhotosRealm().length > 0) {
              realm.delete(this.getAllPhotosRealm());
            }
            if (this.getAllFoldersRealm().length > 0) {
              realm.delete(this.getAllFoldersRealm());
            }
            const newEdges = edges.map(obj => obj.node);
            const allPhotos = realm.create('AllPhotos', { edges: newEdges }, true);

            const listFolders = allPhotos.transformFolders();
            realm.create('AllFoldersList', { items: listFolders }, true);

            // @TODO so it can be shown on home page also
            // @TODO show count badge on setting screen also
            // @TODO add save button in header bar also
          });
          const allFolders = this.getAllFoldersRealm()[0].getFolderList();
          this.setFoldersInState(allFolders);
        }).catch((err) => {
          Alert.alert('Error Refreshing List', err.toString());
        });
    } catch (e) {
      Alert.alert('Error Resetting List', e.toString());
    }
  };


  toggleItem = item => () => {
    realm.write(() => {
      this.getAllFoldersRealm()[0].toggleItem(item);
    });

    this.setState({
      deviceAllFolders: this.getAllFoldersRealm()[0].getFolderList(),
    });
  };

  renderFolderListItem = ({ item }) => (<FolderItem
    item={item}
    touchable
    onPress={this.toggleItem(item)}
  />);

  renderButtons = () => {
    const { isLoading } = this.state;

    if (!isLoading) {
      return (
        <ButtonGroup>
          <Button
            title="Reset List"
            onPress={this.computeFolderList}
          />
        </ButtonGroup>
      );
    }
    return null;
  };

  render() {
    const { deviceAllFolders, isLoading } = this.state;
    const sNotBackedFolders = [...deviceAllFolders].filter(x => x.backedUp === false);
    const sBackedFolders = [...deviceAllFolders].filter(x => x.backedUp === true);

    return (
      <BackupScreen>

        {
          isLoading &&
          <React.Fragment>
            <ActivityIndicator size="large" color={accentColor} />
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                padding: 10,
              }}
            >
              Please wait. It will take time to refresh the folders list
              depending on number of photos/videos in the phone.
            </Text>
          </React.Fragment>
        }

        {
          this.renderButtons()
        }

        {
          !isLoading &&
          sBackedFolders.length > 0 &&
          <FlatList
            renderItem={this.renderFolderListItem}
            ListHeaderComponent={<SectionHeader>Selected Folders</SectionHeader>}
            data={sBackedFolders}
            keyExtractor={(item, index) => item + index}
          />
        }
        {
          !isLoading &&
          sNotBackedFolders.length > 0 &&
          <FlatList
            renderItem={this.renderFolderListItem}
            ListHeaderComponent={<SectionHeader>Not Selected Folders</SectionHeader>}
            data={sNotBackedFolders}
            keyExtractor={(item, index) => item + index}
          />
        }
      </BackupScreen>
    );
  }
}

BackupSettingScreen.propTypes = {};

export default BackupSettingScreen;
