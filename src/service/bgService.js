// noinspection NpmUsedModulesInstalled
import BackgroundTask from 'react-native-background-task';
import { Alert } from 'react-native';
import doFileUpload from './manualFileUpload';

BackgroundTask.define(() => {
  doFileUpload();
  BackgroundTask.finish();
});

function start() {
  BackgroundTask.schedule({
    period: 86400, // Aim to run every 30 mins - more conservative on battery
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
