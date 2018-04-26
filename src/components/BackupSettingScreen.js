import React, { Component } from 'react';
import { Alert, CameraRoll, FlatList, Switch, AsyncStorage, ScrollView } from 'react-native';
import styled from 'styled-components';
// ------ Constants -------- //
import { appBackground, cardBgColor } from '../constants/colors';
// ------ Components -------- //
import FlatButton from './FlatButton';
import BlankInfo from './BlankInfo';
import LoadingPage from './LoadingPage';
import FolderCheckBoxItem from './FolderCheckBoxItem';
// ------ Database -------- //
import realm, { getAllFoldersFromDB, getAllFoldersRealm, getAllPhotosRealm } from '../database/realm';
import Str from '../constants/string';
import fileUtil from '../utils/file';
import BGService from '../service/bgService';
import doPermissionRequest from '../utils/permissions';

const BackupScreen = styled.View`
  padding: 0px;
  background: ${appBackground};
  flex: 1;
  flex-direction: column;
`;

const SectionHeaderWrap = styled.View`
  padding: 15px;
  background: #ddd;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;
const SectionHeader = styled.Text`
  flex: 3;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 0.51px;
  color: #000;
`;

const SwitchWrap = styled.View`
  margin: 5px;
  elevation: 1;
  padding: 20px 15px;
  background-color: ${cardBgColor}
  flex-direction: row;
`;

const SwitchText = styled.Text`
  font-size: 19px;
  flex: 1;
`;


class BackupSettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceEnabled: false,
      isLoading: true,
      deviceAllFolders: [],
    };
  }


  componentDidMount() {
    doPermissionRequest();

    AsyncStorage.getItem('serviceEnabled')
      .then((res) => {
        this.setState({
          serviceEnabled: res === 'true',
        });
      })
      .catch((err) => {});

    try {
      const allFoldersList = getAllFoldersFromDB();
      if (allFoldersList) {
        const allFolders = allFoldersList.getFolderList();
        if (allFolders !== undefined && allFolders !== null && allFolders.length >= 0) {
          this.setFoldersInState(allFolders);
        }
      } else {
        this.computeFolderList();
      }
    } catch (error) {
      Alert.alert('Error Fetching folders', error);
    }
  }

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
            if (getAllPhotosRealm().length > 0) {
              realm.delete(realm.objects('Node'));
              realm.delete(getAllPhotosRealm());
            }
            if (getAllFoldersRealm().length > 0) {
              realm.delete(realm.objects('Folder'));
              realm.delete(getAllFoldersRealm());
            }
            const newEdges = edges.map(obj => obj.node);
            realm.create('AllPhotos', { edges: newEdges }, true);

            const listFolders = fileUtil.transformFolderArray(fileUtil.reduceFolderArray(newEdges));
            realm.create('AllFoldersList', { items: listFolders }, true);
          });
          const allFolders = getAllFoldersFromDB().getFolderList();
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
      getAllFoldersFromDB().toggleItem(item);
    });

    this.setState({
      deviceAllFolders: getAllFoldersFromDB().getFolderList(),
    });
  };


  toggleBackupService = () => {
    AsyncStorage.setItem('serviceEnabled', `${!this.state.serviceEnabled}`)
      .catch((err) => { });

    if (!this.state.serviceEnabled === false) {
      BGService.stop();
    } else {
      BGService.start();
    }

    this.setState((s, p) => ({
      serviceEnabled: !s.serviceEnabled,
    }));
  };


  renderListHeader = () => (
    <SectionHeaderWrap>
      <SectionHeader>Select Folders to Backup</SectionHeader>
      <FlatButton
        title={Str.resetList}
        onPress={this.computeFolderList}
      />
    </SectionHeaderWrap>);

  renderFolderListItem = ({ item }) => (<FolderCheckBoxItem
    item={item}
    touchable
    onPress={this.toggleItem(item)}
  />);


  render() {
    const { deviceAllFolders, isLoading, serviceEnabled } = this.state;
    return (
      <BackupScreen>
        <ScrollView>
          <SwitchWrap>
            <SwitchText>Enable Service</SwitchText>
            <Switch
              onValueChange={this.toggleBackupService}
              value={serviceEnabled}
            />
          </SwitchWrap>

          {isLoading && <LoadingPage text={Str.refreshWaitText} />}

          {
          !isLoading &&
          deviceAllFolders.length > 0 &&
          <FlatList
            renderItem={this.renderFolderListItem}
            ListHeaderComponent={this.renderListHeader}
            data={deviceAllFolders}
            keyExtractor={(item, index) => item + index}
          />
        }

          {
          !isLoading &&
          deviceAllFolders.length === 0 &&
          <BlankInfo
            heading="No Images on Device."
          >
            <FlatButton
              title="Reset List"
              fontSize={22}
              onPress={this.computeFolderList}
            />
          </BlankInfo>
        }
        </ScrollView>
      </BackupScreen>
    );
  }
}

BackupSettingScreen.propTypes = {};

export default BackupSettingScreen;
