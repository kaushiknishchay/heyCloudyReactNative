/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';


import FolderItem from './FolderItem';
import BlankInfo from './BlankInfo';
import FlatButton from './FlatButton';
import Str from '../constants/string';
import { appBackground } from '../constants/colors';
import { getAllFoldersFromDB, getBackupInfo } from '../database/realm';


const HomeWrap = styled.View`
  flex: 1;
  background-color: ${appBackground};
`;

const Section = styled.View`
  background: #fff;
  padding: 30px 20px;
  z-index: 3;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #222;
  margin-bottom: 10px;
`;

const SubText = styled.Text`
  font-size: 17px;
  margin: 5px 0;
  line-height: 20px;
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backupFolders: [],
    };
  }

  componentDidMount() {
    // RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
    //   .then((result) => {
    //     console.log('GOT RESULT', result);
    //     return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    //   })
    //   .then((statResult) => {
    //     if (statResult[0].isFile()) {
    //       return RNFS.readFile(statResult[1], 'utf8');
    //     }
    //     return 'no file';
    //   })
    //   .then((contents) => {
    //     console.log(contents);
    //   })
    //   .catch((err) => {
    //     console.log(err.message, err.code);
    //   });

    this.getFoldersFromRealm();
  }

  getFoldersFromRealm() {
    const allFoldersList = getAllFoldersFromDB();
    if (allFoldersList) {
      const allFolders = allFoldersList.getBackupEnabledFolders();
      this.setState({
        backupFolders: allFolders,
      });
    }
  }

  goToSettings = () => {
    if (this.props.navigation) { this.props.navigation.navigate('BackupSetting'); }
  };

  keyExtractor = item => item.id + item.name;

  renderBackupSection = (backupFolders) => {
    if (backupFolders && backupFolders.length > 0) {
      return (
        <Section>
          <TitleText>Backed Up Folders</TitleText>
          <FlatList
            renderItem={this.renderItem}
            data={backupFolders}
            keyExtractor={this.keyExtractor}
          />
        </Section>);
    }
    return null;
  };

  renderNoFoldersSelected = () => (
    <BlankInfo
      iconClass={Ionicons}
      iconColor="#888"
      icon="ios-information-circle-outline"
      heading={Str.noFolderSelected}
    >
      <FlatButton
        outerStyle={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#dadada',
          }}
        title={Str.goToSetting}
        fontSize={20}
        onPress={this.goToSettings}
      />
    </BlankInfo>);


  renderBackupInfo = (backupFolders) => {
    const backupInfo = getBackupInfo();
    if (backupInfo) {
      return (
        <Section>
          <TitleText>Last Backup Info</TitleText>
          <SubText>Date: {backupInfo.timestamp}</SubText>
          <SubText>Total Files Backed Up: {backupInfo.filesCount}</SubText>
        </Section>);
    }
    if (!backupInfo && backupFolders.length > 0) {
      return (
        <Section>
          <TitleText>Last Backup Info</TitleText>
          <SubText>No Backup done yet.</SubText>
        </Section>
      );
    }
    return null;
  };

  renderItem = ({ item }) => (<FolderItem item={item} />);

  render() {
    const { backupFolders } = this.state;

    return (
      <HomeWrap>

        {this.renderBackupInfo(backupFolders)}

        {this.renderBackupSection(backupFolders)}

        {backupFolders.length === 0 && this.renderNoFoldersSelected()}

      </HomeWrap>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
