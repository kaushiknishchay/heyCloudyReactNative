import React, { Component } from 'react';
import { Alert, AsyncStorage, CameraRoll, SectionList } from 'react-native';
import styled from 'styled-components';


import FolderItem from './FolderItem';
import { backupListKey } from '../constants/storageKeys';
import { appBackground } from '../constants/colors';

const BackupScreen = styled.View`
  padding: 10px;
  background: ${appBackground};
  flex: 1;
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
      deviceFolderList: new Set([]),
      backedUpFolderList: new Set([]),
      notBackedUpFolderList: new Set([]),
    };
  }


  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem(backupListKey);
      if (value !== null) {
        this.setState({
          deviceFolderList: JSON.parse(value),
        });
      } else {
        this.computeFolderList();
      }
    } catch (error) {
      console.error('Error retrieving folder list from device', error);
    }
  };

  onItemPress = () => {
    alert('aa');
  };

  computeFolderList = async () => {
    CameraRoll.getPhotos({
      first: 99999,
    }).then(res => res.edges)
      .then((edges) => {
        const tempList = new Set([]);

        edges.forEach((photoItem) => {
          const groupName = photoItem.node.group_name;

          // @TODO Implement name and count Set Object for each folder and save it
          // @TODO so it can be shown on home page also
          // @TODO show count badge on setting screen also
          // @TODO add save button in header bar also
          // @TODO change header bar color, setup color constants

          if (!tempList.has(groupName)) {
            tempList.add(groupName);
          }
        });

        try {
          AsyncStorage.setItem(backupListKey, JSON.stringify([...tempList]));
        } catch (error) {
          console.log('Error on saving folder List to device', error);
        }

        this.setState({
          deviceFolderList: [...tempList],
        });
      }).catch((err) => {
        Alert.alert('Error', JSON.stringify(err));
      });
  };


  render() {
    const { deviceFolderList, backedUpFolderList, notBackedUpFolderList } = this.state;
    const listData = [
      { title: 'Selected Folders', data: [...backedUpFolderList.values()] },
      { title: 'Not Selected Folders', data: deviceFolderList },
    ];
    return (
      <BackupScreen>
        {deviceFolderList.length > 0 &&
        <SectionList
          renderItem={({ item }) => <FolderItem item={item} touchable onPress={this.onItemPress} />}
          renderSectionHeader={({ section: { title } }) => <SectionHeader>{title}</SectionHeader>}
          sections={listData}
          keyExtractor={(item, index) => item + index}
        />
        }
      </BackupScreen>
    );
  }
}

BackupSettingScreen.propTypes = {};

export default BackupSettingScreen;
