import React, { Component } from 'react';
import { Alert, CameraRoll, FlatList } from 'react-native';
import styled from 'styled-components';
// ------ Constants -------- //
import { appBackground } from '../constants/colors';
// ------ Components -------- //
import FlatButton from './FlatButton';
import BlankInfo from './BlankInfo';
import LoadingPage from './LoadingPage';
import FolderCheckBoxItem from './FolderCheckBoxItem';
// ------ Database -------- //
import realm, { getAllFoldersFromDB, getAllFoldersRealm, getAllPhotosRealm } from '../database/realm';
import Str from '../constants/string';
import fileUtil from '../utils/file';

const BackupScreen = styled.View`
  padding: 0px 0 10px 0;
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
              realm.delete(getAllPhotosRealm());
            }
            if (getAllFoldersRealm().length > 0) {
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

  renderFolderListItem = ({ item }) => (<FolderCheckBoxItem
    item={item}
    touchable
    onPress={this.toggleItem(item)}
  />);

  renderListHeader = () => (
    <SectionHeaderWrap>
      <SectionHeader>Select Folders to Backup</SectionHeader>
      <FlatButton
        title={Str.resetList}
        onPress={this.computeFolderList}
      />
    </SectionHeaderWrap>);

  render() {
    const { deviceAllFolders, isLoading } = this.state;

    return (
      <BackupScreen>

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

      </BackupScreen>
    );
  }
}

BackupSettingScreen.propTypes = {};

export default BackupSettingScreen;
