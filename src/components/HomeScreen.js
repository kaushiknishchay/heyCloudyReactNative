import React, { Component } from 'react';
import { FlatList, AsyncStorage } from 'react-native';
import styled from 'styled-components';


import FolderItem from './FolderItem';
import { appBackground } from '../constants/colors';
import { backupFoldersKey } from '../constants/storageKeys';
import realm from '../database/realm';

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
    this.getFoldersFromRealm();
  }

  getFoldersFromRealm() {
    const allFoldersList = this.getAllFoldersRealm();
    if (allFoldersList.length > 0) {
      const allFolders = allFoldersList[0].getBackupEnabledFolders();
      this.setState({
        backupFolders: allFolders,
      });
    }
  }

  getAllFoldersRealm = () => realm.objects('AllFoldersList');

  keyExtractor = item => item.id + item.name;

  renderItem = ({ item }) => (
    <FolderItem item={item} />);


  render() {
    const { backupFolders } = this.state;
    // const backupFolders = [
    //   {
    //     name: 'DCIM',
    //     count: 30,
    //   },
    //   {
    //     name: 'Camera',
    //     count: 20,
    //   }, {
    //     name: 'Snapseed',
    //     count: 40,
    //   },
    // ];
    return (
      <HomeWrap>
        <Section>
          <TitleText>Last Backup Info</TitleText>
          <SubText>Date: </SubText>
          <SubText>Total Files Backed Up: </SubText>
        </Section>

        <Section>
          <TitleText>Backed Up Folders</TitleText>
          <FlatList
            renderItem={this.renderItem}
            data={backupFolders}
            keyExtractor={this.keyExtractor}
          />
        </Section>
      </HomeWrap>
    );
  }
}

Home.propTypes = {};

export default Home;
