import React, { Component } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components';
import FolderItem from './FolderItem';
import { appBackground } from '../constants/colors';

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
  keyExtractor = item => item.name;

  renderItem = ({ item }) => (
    <FolderItem item={item} />);

  render() {
    const backupFolders = [
      {
        name: 'DCIM',
        count: 30,
      },
      {
        name: 'Camera',
        count: 20,
      }, {
        name: 'Snapseed',
        count: 40,
      },
    ];

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
