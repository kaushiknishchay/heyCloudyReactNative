/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import { ActivityIndicator, Button, FlatList, ScrollView } from 'react-native';
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
import { BoldText, Section, SubText, TitleText } from './SimpleComponents';


const HomeWrap = styled.View`
  flex: 1;
  background-color: ${appBackground};
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
    if (this.state.isBackingUp === false) { doFileUpload(this.setBackUpInfo); }
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
          <TitleText>{Str.selectedFolderTitle}</TitleText>
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
          <TitleText>{Str.backupInfoTitle}</TitleText>

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
          <TitleText>{Str.backupInfoTitle}</TitleText>
          <SubText>{Str.noBackupText}</SubText>
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
          <TitleText>{Str.manualBackupTitle}</TitleText>

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
    if (backupFolders.length === 0) {
      return (this.renderNoFoldersSelected());
    }

    return (
      <HomeWrap>
        <ScrollView>
          {this.renderManualBackupSection()}

          {this.renderBackupInfo(backupFolders)}

          {this.renderBackupSection(backupFolders)}
        </ScrollView>

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
