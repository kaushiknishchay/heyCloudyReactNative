// noinspection NpmUsedModulesInstalled
import BackgroundTask from 'react-native-background-task';
import { Alert } from 'react-native';

import realm, { getAllFoldersFromDB, getAllPhotosRealm } from '../database/realm';
import startFileUpload from './fileUpload';
import fileUtil from '../utils/file';

BackgroundTask.define(() => {
  // console.log('Starting Files Sync');

  const allPhotosRealm = getAllPhotosRealm();
  if (allPhotosRealm !== undefined && allPhotosRealm.length > 0) {
    const allPhotos = allPhotosRealm[0];
    try {
      // Get the folders to with backup property as true;
      const backupFolders = [...realm.objects('Folder')].map(obj => obj.data);

      if (allPhotos) {
        const abc = allPhotos.getPhotosToBackup(backupFolders);
        abc.forEach(async (obj) => {
          const { uri } = obj.image;
          await fileUtil.getFileStat(uri)
            .then((stats) => {
              startFileUpload({
                path: `${stats.path}`,
                headers: {
                  'content-type': obj.type, // server requires a content-type header
                  filePath: stats.path,
                },
              });
            });
        });
      }
    } catch (e) {
      // console.error('Failed to Upload Files', e);
    }
  }
  BackgroundTask.finish();
});

function start() {
  BackgroundTask.schedule({
    period: 900, // Aim to run every 30 mins - more conservative on battery
  });
}


function stop() {
  BackgroundTask.statusAsync()
    .then((res) => {
      if (res && res.available === true) {
        BackgroundTask.cancel();
      }
    })
    .catch((err) => {});
}

async function checkStatus() {
  const status = await BackgroundTask.statusAsync();

  if (status.available) {
    // Everything's fine
    return;
  }

  const reason = status.unavailableReason;
  if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
    Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app');
  } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
    Alert.alert('Restricted', 'Background tasks are restricted on your device');
  }
}


const BGService = {
  start,
  stop,
  checkStatus,
};

export default BGService;
