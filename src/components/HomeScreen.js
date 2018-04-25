/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import { ActivityIndicator, Button, FlatList } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';


import FolderItem from './FolderItem';
import BlankInfo from './BlankInfo';
import FlatButton from './FlatButton';
import Str from '../constants/string';
import { accentColor, appBackground } from '../constants/colors';
import doPermissionRequest from '../utils/permissions';
import { getAllFoldersFromDB } from '../database/realm';
import doFileUpload from '../service/manualFileUpload';


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
const BoldText = styled.Text`
  letter-spacing:0.4px;
  font-weight: bold;
  color: ${props => (props.color ? props.color : '#333')};
`;

const SubText = styled.Text`
  font-size: 17px;
  margin: 5px 0;
  color: #555;
  line-height: 20px;
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backupFolders: [],
      isBackingUp: false,
    };
  }

  componentDidMount() {
    doPermissionRequest();
    this.getFoldersFromRealm();
    this.setBackUpInfo();
  }

  setBackUpInfo = () => {
    this.props.getBackupInfo();
    this.setState((s, p) => ({
      isBackingUp: false,
    }));
  };

  getFoldersFromRealm() {
    const allFoldersList = getAllFoldersFromDB();
    if (allFoldersList) {
      const allFolders = allFoldersList.getBackupEnabledFolders();
      this.setState({
        backupFolders: allFolders,
      });
    }
  }

  doManualBackup = () => {
    doFileUpload(this.setBackUpInfo);
    this.setState((s, p) => ({
      isBackingUp: true,
    }));
  };

  goToSettings = () => {
    if (this.props.navigation) { this.props.navigation.navigate('BackupSetting'); }
  };

  keyExtractor = item => item.id + item.name;

  renderBackupSection = (backupFolders) => {
    if (backupFolders && backupFolders.length > 0) {
      return (
        <Section>
          <TitleText>Selected Folders</TitleText>
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
    const { backupInfo } = this.props;

    if (backupInfo && backupFolders.length > 0) {
      const time = new Date(backupInfo.timestamp);


      return (
        <Section>
          <TitleText>Last Backup Info</TitleText>

          <SubText>
            <BoldText>Date: </BoldText>
            {`${time.toDateString()} ${time.toLocaleTimeString()}`}
          </SubText>

          <SubText>
            <BoldText>Files uploaded: </BoldText>
            {backupInfo.filesCount}
          </SubText>
          {
            backupInfo.errorFilesCount > 0 &&
            <SubText>
              <BoldText color="#c00">Files failed: </BoldText>
              {backupInfo.errorFilesCount}
            </SubText>
          }
          {
            backupInfo.errorFilesCount > 0 &&
            <SubText>
              <BoldText color="#cc0000">Error: </BoldText>
              {backupInfo.errorMessage}
            </SubText>
          }

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

  renderManualBackupSection = () => {
    const { backupFolders, isBackingUp } = this.state;
    if (backupFolders && backupFolders.length > 0) {
      return (
        <Section>
          <TitleText>Click to backup</TitleText>

          <Button
            title="Backup"
            disabled={isBackingUp}
            onPress={this.doManualBackup}
          />

          {
            isBackingUp &&
            <ActivityIndicator
              size="large"
              color={accentColor}
            />
          }

        </Section>);
    }
    return null;
  };

  renderItem = ({ item }) => (<FolderItem item={item} />);

  render() {
    const { backupFolders } = this.state;

    return (
      <HomeWrap>

        {this.renderManualBackupSection()}

        {this.renderBackupInfo(backupFolders)}

        {this.renderBackupSection(backupFolders)}

        {backupFolders.length === 0 && this.renderNoFoldersSelected()}

      </HomeWrap>
    );
  }
}
Home.defaultProps = {
  backupInfo: undefined,
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
  backupInfo: PropTypes.object,
  getBackupInfo: PropTypes.func.isRequired,
};

function initMapStateToProps(state) {
  const app = state.get('backupApp');
  const backupInfo = app.get('backupInfo') !== undefined ? app.get('backupInfo').toJS() : undefined;
  return {
    backupInfo,
  };
}

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    getBackupInfo: () => dispatch({ type: 'BACKUP_INFO_FETCH' }),
  }, dispatch);
}

export default connect(initMapStateToProps, initMapDispatchToProps)(Home);
